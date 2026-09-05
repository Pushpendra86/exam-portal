import { Repository } from "typeorm";
import { Admin } from "../entities/admin.entity";

export class AdminRepository {
  constructor(private readonly repository: Repository<Admin>) { }

  async findById(id: number): Promise<Admin | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return this.repository.findOneBy({ username });
  }

  async create(data: { username: string; password: string }): Promise<Admin> {
    const admin = this.repository.create(data);
    return this.repository.save(admin);
  }

  async findOrCreateDefaultAdmin(
    username: string,
    hashedPassword: string
  ): Promise<Admin> {
    const existing = await this.findByUsername(username);
    if (existing) return existing;
    return this.create({ username, password: hashedPassword });
  }
}
