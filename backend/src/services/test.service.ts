import { TestRepository } from "../repositories/test.repository";
import { QuestionRepository } from "../repositories/question.repository";
import { TestRegistrationRepository } from "../repositories/test-registration.repository";
import { TestStatus } from "../models";
import { AppError } from "../utils/app-error";

export class TestService {
  constructor(
    private readonly testRepository: TestRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly testRegistrationRepository: TestRegistrationRepository
  ) {}

  getTestStatus(test: {
    status: string;
    result_time: Date;
    end_time: Date;
    start_time: Date | null;
    reg_end_time: Date;
    reg_start_time: Date;
  }): TestStatus {
    if (test.status === TestStatus.CANCELLED) return test.status;
    const now = Date.now();
    if (Date.parse(String(test.result_time)) < now) return TestStatus.RESULT_DECLARED;
    if (Date.parse(String(test.end_time)) < now) return TestStatus.TEST_COMPLETE;
    if (test.start_time && Date.parse(String(test.start_time)) < now) return TestStatus.TEST_STARTED;
    if (Date.parse(String(test.reg_end_time)) < now) return TestStatus.REGISTRATION_COMPLETE;
    if (Date.parse(String(test.reg_start_time)) < now) return TestStatus.REGISTRATION_STARTED;
    return TestStatus.CREATED;
  }

  async updateTestStatusIfChanged(test: {
    id: number;
    status: string;
    result_time: Date;
    end_time: Date;
    start_time: Date | null;
    reg_end_time: Date;
    reg_start_time: Date;
  }): Promise<TestStatus> {
    const correctStatus = this.getTestStatus(test);
    if (correctStatus !== test.status) {
      await this.testRepository.updateStatus(test.id, correctStatus);
    }
    return correctStatus;
  }

  private async generateTestpaper(subjects: number[], maxmarks: number, queTypes: number[]) {
    const quelist: number[] = [];
    const anslist: string[] = [];
    try {
      const allQuestions = await this.questionRepository.findActiveBySubjectsAndMarks(
        subjects, queTypes
      );
      const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
      if (totalMarks < maxmarks) {
        console.log("not enough questions for subjects");
        return { quelist, anslist };
      }
      let remaining = maxmarks;
      const qIndexSet = new Set<number>();
      while (remaining > 0) {
        const i = Math.floor(Math.random() * allQuestions.length);
        if (qIndexSet.has(i) || allQuestions[i].marks > remaining) continue;
        qIndexSet.add(i);
        quelist.push(allQuestions[i].id);
        anslist.push(allQuestions[i].answer);
        remaining -= allQuestions[i].marks;
      }
    } catch (err) {
      console.log(err);
    }
    return { quelist, anslist };
  }

  async createTest(data: {
    title: string;
    subjects: number[];
    maxmarks: number;
    queTypes: number[];
    startTime: string;
    endTime: string;
    duration: number;
    regStartTime: string;
    regEndTime: string;
    resultTime: string;
    createdBy: number;
  }) {
    const genQue = await this.generateTestpaper(data.subjects, data.maxmarks, data.queTypes);
    if (genQue.quelist.length < 1) {
      throw new AppError("Not enough questions for selected subject", 400);
    }
    await this.testRepository.createTest({
      title: data.title,
      subjects: data.subjects,
      questions: genQue.quelist,
      answers: genQue.anslist,
      maxmarks: data.maxmarks,
      que_types: data.queTypes,
      start_time: data.startTime,
      end_time: data.endTime,
      duration: data.duration,
      reg_start_time: data.regStartTime,
      reg_end_time: data.regEndTime,
      result_time: data.resultTime,
      created_by: data.createdBy,
    });
  }

  async getAllTests() {
    const tests = await this.testRepository.findAllOrdered();
    for (const test of tests) {
      await this.updateTestStatusIfChanged(test);
    }
    return tests.map((t) => ({ _id: t.id, title: t.title, status: t.status }));
  }

  async testRegistration(userId: number, testId: number) {
    const test = await this.testRepository.findById(testId);
    if (!test) throw new AppError("Test not found", 404);

    const status = await this.updateTestStatusIfChanged(test);
    if (status !== TestStatus.REGISTRATION_STARTED) {
      throw new AppError("Test Registration are not open", 400);
    }

    const existing = await this.testRegistrationRepository.findByUserAndTest(userId, testId);
    if (existing) {
      throw new AppError("your registration for test is done", 400);
    }

    await this.testRegistrationRepository.create({ user_id: userId, test_id: testId });
  }

  async getAllTestsWithRegistrationCheck(studentId: number) {
    const tests = await this.testRepository.findAllOrderedAsc();
    const registeredIds = await this.testRegistrationRepository.findTestIdsByUser(studentId);

    const testlist = [];
    for (const test of tests) {
      const status = await this.updateTestStatusIfChanged(test);
      testlist.push({
        _id: test.id,
        title: test.title,
        status,
        isRegistered: registeredIds.includes(test.id),
        startTime: test.start_time,
        endTime: test.end_time,
        regStartTime: test.reg_start_time,
        regEndTime: test.reg_end_time,
        resultTime: test.result_time,
        maxmarks: test.maxmarks,
        duration: test.duration,
      });
    }
    return testlist;
  }

  async getUpcomingTests(studentId: number) {
    const tests = await this.testRepository.findUpcoming();
    const registeredIds = await this.testRegistrationRepository.findTestIdsByUser(studentId);

    const testlist = [];
    for (const test of tests) {
      const status = await this.updateTestStatusIfChanged(test);
      if (registeredIds.includes(test.id)) {
        testlist.push({
          _id: test.id,
          title: test.title,
          status,
          startTime: test.start_time,
          endTime: test.end_time,
          resultTime: test.result_time,
          maxmarks: test.maxmarks,
          duration: test.duration,
        });
      }
    }
    return testlist;
  }

  async getTestDetails(testId: number, userType: string) {
    const test = await this.testRepository.findById(testId);
    if (!test) throw new AppError("test id not found", 404);
    const status = await this.updateTestStatusIfChanged(test);

    const base = {
      _id: test.id,
      title: test.title,
      status,
      startTime: test.start_time,
      endTime: test.end_time,
      regStartTime: test.reg_start_time,
      regEndTime: test.reg_end_time,
      resultTime: test.result_time,
      maxmarks: test.maxmarks,
      duration: test.duration,
    };

    if (userType === "STUDENT") return base;
    return { ...base, subjects: test.subjects, queTypes: test.que_types };
  }
}
