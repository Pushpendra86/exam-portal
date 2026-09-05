import { Repository } from "typeorm";
import { Subject } from "../entities/subject.entity";

export class SubjectRepository {
  constructor(private readonly repository: Repository<Subject>) { }

  async findById(id: number): Promise<Subject | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Subject[]> {
    return this.repository.find();
  }

  async findByName(name: string): Promise<Subject | null> {
    return this.repository.findOneBy({ name });
  }

  async create(data: { name: string; created_by?: number }): Promise<Subject> {
    const subject = this.repository.create({
      name: data.name,
      created_by: data.created_by ?? null,
    });
    return this.repository.save(subject);
  }

  async updateStatus(id: number, status: boolean): Promise<boolean> {
    const result = await this.repository.update(id, { status });
    return (result.affected ?? 0) > 0;
  }

  async findActive(): Promise<Subject[]> {
    return this.repository.find({ where: { status: true }, select: { id: true, name: true, status: true } });
  }

  async countByStatus(): Promise<{ status: boolean; count: number }[]> {
    return this.repository
      .createQueryBuilder("subject")
      .select("subject.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("subject.status")
      .getRawMany();
  }

  async findByIds(ids: number[]): Promise<Subject[]> {
    return this.repository.findBy(ids.map((id) => ({ id })));
  }
}
