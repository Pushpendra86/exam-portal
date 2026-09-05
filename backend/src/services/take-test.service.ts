import { TestRepository } from "../repositories/test.repository";
import { AnswerSheetRepository } from "../repositories/answer-sheet.repository";
import { TestRegistrationRepository } from "../repositories/test-registration.repository";
import { QuestionRepository } from "../repositories/question.repository";
import { TestService } from "./test.service";
import { TestStatus } from "../models";
import { AppError } from "../utils/app-error";

export class TakeTestService {
  constructor(
    private readonly testRepository: TestRepository,
    private readonly answerSheetRepository: AnswerSheetRepository,
    private readonly testRegistrationRepository: TestRegistrationRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly testService: TestService
  ) {}

  private getAttemptEndTime(test: { duration: number; end_time: Date }, startAttemptTime: Date): Date {
    const regularEndTime = new Date(Date.parse(String(startAttemptTime)) + test.duration * 1000);
    const endTime = new Date(Date.parse(String(test.end_time)));
    return regularEndTime < endTime ? regularEndTime : endTime;
  }

  private sortByIds<T extends { id: number }>(questions: T[], ids: number[]): T[] {
    const result: T[] = [];
    for (const id of ids) {
      const found = questions.find((q) => q.id === id);
      if (found) result.push(found);
    }
    return result;
  }

  async calculateMarks(questionIds: number[], answers: string[], answerSheetId: number) {
    let marks = 0;
    const questionDetails = await this.questionRepository.findByIds(questionIds);
    if (questionDetails.length !== questionIds.length) return;

    for (const q of questionDetails) {
      const index = questionIds.indexOf(q.id);
      if (index !== -1 && answers[index] != null) {
        if (q.answer === answers[index]) {
          marks += q.marks;
        }
      }
    }
    await this.answerSheetRepository.completeAndUpdateScore(answerSheetId, marks);
  }

  async startTest(studentId: number, testId: number) {
    const test = await this.testRepository.findById(testId);
    if (!test) throw new AppError("Unable to find test", 404);

    const status = await this.testService.updateTestStatusIfChanged(test);

    if (status !== TestStatus.TEST_STARTED) {
      if (status === TestStatus.TEST_COMPLETE) {
        throw new AppError("Test time is over", 400);
      }
      throw new AppError("Test is not started", 400);
    }

    const registration = await this.testRegistrationRepository.findByUserAndTest(studentId, testId);
    if (!registration) throw new AppError("You are not registered", 400);

    let answersheet = await this.answerSheetRepository.findByStudentAndTest(studentId, testId);

    if (answersheet) {
      if (Date.now() > this.getAttemptEndTime(test, answersheet.start_time!).getTime()) {
        await this.answerSheetRepository.markCompleted(answersheet.id);
        this.calculateMarks(test.questions, answersheet.answers, answersheet.id);
      }
      if (answersheet.completed) {
        throw new AppError("you have taken this test", 400);
      }
      return { answersheet, questions: test.questions, message: "test is already started" };
    }

    answersheet = await this.answerSheetRepository.create({
      test_id: testId,
      student_id: studentId,
    });
    return { answersheet, questions: test.questions, message: "Test started" };
  }

  async getQuestionsWithStartTime(
    studentId: number,
    answerSheetId: number,
    questionIds: number[],
    addStartTime: boolean
  ) {
    const questions = await this.questionRepository.findByIds(questionIds);
    const sorted = this.sortByIds(questions, questionIds);

    let startTime: Date;
    if (addStartTime) {
      startTime = new Date();
      await this.answerSheetRepository.updateStartTime(answerSheetId, startTime);
    } else {
      const as = await this.answerSheetRepository.findById(answerSheetId);
      if (!as || !as.start_time) {
        throw new AppError("answersheet not found", 404);
      }
      startTime = as.start_time;
    }

    return {
      startTime,
      questions: sorted.map((x) => ({
        _id: x.id,
        body: x.body,
        options: x.options,
        marks: x.marks,
        subject: x.subject,
      })),
    };
  }

  async saveAnswer(studentId: number, answerSheetId: number, answers: string[]) {
    const answersheet = await this.answerSheetRepository.findById(answerSheetId);
    if (!answersheet) throw new AppError("Answersheet not found", 404);
    if (answersheet.completed) return { testDone: true };

    const test = await this.testRepository.findById(answersheet.test_id);
    if (!test) throw new AppError("Test not found", 404);

    if (Date.now() - this.getAttemptEndTime(test, answersheet.start_time!).getTime() > 0) {
      await this.answerSheetRepository.completeWithAnswers(answerSheetId, answers);
      this.calculateMarks(test.questions, answers, answerSheetId);
      return { testDone: true };
    }

    await this.answerSheetRepository.updateAnswers(answerSheetId, answers);
    return { testDone: false };
  }

  async endTest(studentId: number, answerSheetId: number, answers: string[]) {
    const answersheet = await this.answerSheetRepository.findById(answerSheetId);
    if (!answersheet) throw new AppError("Answersheet not found", 404);
    if (answersheet.completed) throw new AppError("Test is completed", 400);

    const test = await this.testRepository.findById(answersheet.test_id);
    if (!test) throw new AppError("Test not found", 404);

    if (Date.now() - this.getAttemptEndTime(test, answersheet.start_time!).getTime() > 10 * 1000) {
      await this.answerSheetRepository.markCompleted(answersheet.id);
      this.calculateMarks(test.questions, answersheet.answers, answersheet.id);
    } else {
      await this.answerSheetRepository.completeWithAnswers(answerSheetId, answers);
      this.calculateMarks(test.questions, answers, answerSheetId);
    }
  }
}
