import { AppDataSource } from "../config/database";
import { Question } from "../models/question.model";

const repo = () => AppDataSource.getRepository(Question);

export class QuestionRepository {
  async findById(id: number): Promise<Question | null> {
    return repo().findOneBy({ id });
  }

  async create(data: {
    body: string;
    explanation?: string;
    options: string[];
    subject: number;
    answer: string;
    marks: number;
    created_by?: number;
  }): Promise<Question> {
    const question = repo().create({
      body: data.body,
      explanation: data.explanation ?? null,
      options: data.options,
      subject: data.subject,
      answer: data.answer,
      marks: data.marks,
      created_by: data.created_by ?? null,
    });
    return repo().save(question);
  }

  async searchByBody(query: string, limit = 20): Promise<Question[]> {
    return repo()
      .createQueryBuilder("q")
      .select(["q.id", "q.body", "q.status"])
      .where("q.body ILIKE :query", { query: `%${query}%` })
      .limit(limit)
      .getMany();
  }

  async update(
    id: number,
    data: Partial<{
      body: string;
      explanation: string | null;
      options: string[];
      subject: number;
      marks: number;
      answer: string;
      created_by: number | null;
    }>
  ): Promise<boolean> {
    const result = await repo().update(id, data as any);
    return (result.affected ?? 0) > 0;
  }

  async updateStatus(
    id: number,
    status: boolean,
    createdBy: number
  ): Promise<boolean> {
    const result = await repo().update(id, { status, created_by: createdBy });
    return (result.affected ?? 0) > 0;
  }

  async findActiveBySubjectsAndMarks(
    subjects: number[],
    marks: number[]
  ): Promise<Question[]> {
    return repo()
      .createQueryBuilder("q")
      .where("q.status = true")
      .andWhere("q.subject IN (:...subjects)", { subjects })
      .andWhere("q.marks IN (:...marks)", { marks })
      .getMany();
  }

  async findByIds(ids: number[]): Promise<Question[]> {
    return repo().findBy(ids.map((id) => ({ id })));
  }
}
