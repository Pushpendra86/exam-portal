import { TestRepository } from "../repositories/test.repository";
import { AnswerSheetRepository } from "../repositories/answer-sheet.repository";
import { SubjectRepository } from "../repositories/subject.repository";
import { TestService } from "./test.service";

export class ResultService {
  constructor(
    private readonly testRepository: TestRepository,
    private readonly answerSheetRepository: AnswerSheetRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly testService: TestService
  ) {}

  async getCompletedTests(studentId: number) {
    const testIds = await this.answerSheetRepository.findCompletedTestIdsByStudent(studentId);

    if (testIds.length === 0) return [];

    const tests = await this.testRepository.findByIds(testIds);
    for (const test of tests) {
      const status = await this.testService.updateTestStatusIfChanged(test);
      (test as { status: string }).status = status;
    }

    return tests.map((t) => ({
      _id: t.id,
      title: t.title,
      status: t.status,
      maxmarks: t.maxmarks,
      subjects: t.subjects,
    }));
  }

  async getResultDetails(studentId: number, testId: number) {
    const answersheet = await this.answerSheetRepository.findResultByStudentAndTest(
      studentId, testId
    );
    if (!answersheet) return null;

    const test = await this.testRepository.findById(testId);
    if (!test) return null;

    const status = await this.testService.updateTestStatusIfChanged(test);

    const subjects = await this.subjectRepository.findByIds(test.subjects);
    const subjectNames = subjects.map((s) => s.name);

    return {
      title: test.title,
      status,
      maxmarks: test.maxmarks,
      subjects: subjectNames,
      score: answersheet.score,
      questions: test.questions,
      answers: answersheet.answers,
    };
  }
}
