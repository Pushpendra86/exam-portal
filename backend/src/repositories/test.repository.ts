import { AppDataSource } from "../config/database";
import { Test, TestStatus } from "../models/test.model";

const repo = () => AppDataSource.getRepository(Test);

export class TestRepository {
  async findById(id: number): Promise<Test | null> {
    return repo().findOneBy({ id });
  }

  async createTest(data: {
    title: string;
    subjects: number[];
    questions: number[];
    answers: string[];
    maxmarks: number;
    que_types: number[];
    start_time: string;
    end_time: string;
    duration: number;
    reg_start_time: string;
    reg_end_time: string;
    result_time: string;
    created_by: number;
  }): Promise<Test> {
    const test = repo().create({
      title: data.title,
      subjects: data.subjects,
      questions: data.questions,
      answers: data.answers,
      maxmarks: data.maxmarks,
      que_types: data.que_types,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
      duration: data.duration,
      reg_start_time: new Date(data.reg_start_time),
      reg_end_time: new Date(data.reg_end_time),
      result_time: new Date(data.result_time),
      created_by: data.created_by,
    });
    return repo().save(test);
  }

  async findAllOrdered(): Promise<Test[]> {
    return repo().find({ order: { start_time: "DESC" } });
  }

  async findAllOrderedAsc(): Promise<Test[]> {
    return repo().find({ order: { start_time: "ASC" } });
  }

  async findUpcoming(): Promise<Test[]> {
    return repo()
      .createQueryBuilder("t")
      .where("t.end_time > :now", { now: new Date() })
      .orderBy("t.start_time", "ASC")
      .getMany();
  }

  async updateStatus(id: number, status: TestStatus): Promise<boolean> {
    const result = await repo().update(id, { status });
    return (result.affected ?? 0) > 0;
  }

  async findByIds(ids: number[]): Promise<Test[]> {
    return repo().findBy(ids.map((id) => ({ id })));
  }
}
