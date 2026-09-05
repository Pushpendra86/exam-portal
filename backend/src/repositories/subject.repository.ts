import { AppDataSource } from "../config/database";
import { Subject } from "../models/subject.model";

const repo = () => AppDataSource.getRepository(Subject);

export class SubjectRepository {
  async findById(id: number): Promise<Subject | null> {
    return repo().findOneBy({ id });
  }

  async findAll(): Promise<Subject[]> {
    return repo().find();
  }

  async findByName(name: string): Promise<Subject | null> {
    return repo().findOneBy({ name });
  }

  async create(data: { name: string; created_by?: number }): Promise<Subject> {
    const subject = repo().create({
      name: data.name,
      created_by: data.created_by ?? null,
    });
    return repo().save(subject);
  }

  async updateStatus(id: number, status: boolean): Promise<boolean> {
    const result = await repo().update(id, { status });
    return (result.affected ?? 0) > 0;
  }

  async findActive(): Promise<Subject[]> {
    return repo().find({ where: { status: true }, select: { id: true, name: true, status: true } });
  }

  async countByStatus(): Promise<{ status: boolean; count: number }[]> {
    return repo()
      .createQueryBuilder("subject")
      .select("subject.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("subject.status")
      .getRawMany();
  }

  async findByIds(ids: number[]): Promise<Subject[]> {
    return repo().findBy(ids.map((id) => ({ id })));
  }
}
