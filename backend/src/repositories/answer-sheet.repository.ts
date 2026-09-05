import { Repository } from "typeorm";
import { AnswerSheet } from "../entities/answer-sheet.entity";

export class AnswerSheetRepository {
  constructor(private readonly repository: Repository<AnswerSheet>) { }

  async findById(id: number): Promise<AnswerSheet | null> {
    return this.repository.findOneBy({ id });
  }

  async create(data: {
    test_id: number;
    student_id: number;
  }): Promise<AnswerSheet> {
    const sheet = this.repository.create(data);
    return this.repository.save(sheet);
  }

  async findByStudentAndTest(
    studentId: number,
    testId: number
  ): Promise<AnswerSheet | null> {
    return this.repository.findOneBy({ student_id: studentId, test_id: testId });
  }

  async updateStartTime(id: number, startTime: Date): Promise<boolean> {
    const result = await this.repository.update(id, { start_time: startTime });
    return (result.affected ?? 0) > 0;
  }

  async updateAnswers(id: number, answers: string[]): Promise<boolean> {
    const result = await this.repository.update(id, { answers });
    return (result.affected ?? 0) > 0;
  }

  async completeAndUpdateScore(id: number, score: number): Promise<boolean> {
    const result = await this.repository.update(id, { completed: true, score });
    return (result.affected ?? 0) > 0;
  }

  async markCompleted(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { completed: true });
    return (result.affected ?? 0) > 0;
  }

  async completeWithAnswers(id: number, answers: string[]): Promise<boolean> {
    const result = await this.repository.update(id, { answers, completed: true });
    return (result.affected ?? 0) > 0;
  }

  async findCompletedTestIdsByStudent(studentId: number): Promise<number[]> {
    const results = await this.repository.find({
      where: { student_id: studentId, completed: true },
      select: { test_id: true },
    });
    return results.map((r) => r.test_id);
  }

  async findResultByStudentAndTest(
    studentId: number,
    testId: number
  ): Promise<AnswerSheet | null> {
    return this.repository.findOneBy({
      student_id: studentId,
      test_id: testId,
      completed: true,
    });
  }
}
