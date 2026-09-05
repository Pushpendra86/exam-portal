import { AppDataSource } from "../config/database";
import { AnswerSheet } from "../models/answer-sheet.model";

const repo = () => AppDataSource.getRepository(AnswerSheet);

export class AnswerSheetRepository {
  async findById(id: number): Promise<AnswerSheet | null> {
    return repo().findOneBy({ id });
  }

  async create(data: {
    test_id: number;
    student_id: number;
  }): Promise<AnswerSheet> {
    const sheet = repo().create(data);
    return repo().save(sheet);
  }

  async findByStudentAndTest(
    studentId: number,
    testId: number
  ): Promise<AnswerSheet | null> {
    return repo().findOneBy({ student_id: studentId, test_id: testId });
  }

  async updateStartTime(id: number, startTime: Date): Promise<boolean> {
    const result = await repo().update(id, { start_time: startTime });
    return (result.affected ?? 0) > 0;
  }

  async updateAnswers(id: number, answers: string[]): Promise<boolean> {
    const result = await repo().update(id, { answers });
    return (result.affected ?? 0) > 0;
  }

  async completeAndUpdateScore(id: number, score: number): Promise<boolean> {
    const result = await repo().update(id, { completed: true, score });
    return (result.affected ?? 0) > 0;
  }

  async markCompleted(id: number): Promise<boolean> {
    const result = await repo().update(id, { completed: true });
    return (result.affected ?? 0) > 0;
  }

  async completeWithAnswers(id: number, answers: string[]): Promise<boolean> {
    const result = await repo().update(id, { answers, completed: true });
    return (result.affected ?? 0) > 0;
  }

  async findCompletedTestIdsByStudent(studentId: number): Promise<number[]> {
    const results = await repo().find({
      where: { student_id: studentId, completed: true },
      select: { test_id: true },
    });
    return results.map((r) => r.test_id);
  }

  async findResultByStudentAndTest(
    studentId: number,
    testId: number
  ): Promise<AnswerSheet | null> {
    return repo().findOneBy({
      student_id: studentId,
      test_id: testId,
      completed: true,
    });
  }
}
