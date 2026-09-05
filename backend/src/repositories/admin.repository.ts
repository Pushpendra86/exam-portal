import { AppDataSource } from "../config/database";
import { Admin } from "../models/admin.model";

const repo = () => AppDataSource.getRepository(Admin);

export class AdminRepository {
  async findById(id: number): Promise<Admin | null> {
    return repo().findOneBy({ id });
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return repo().findOneBy({ username });
  }

  async create(data: { username: string; password: string }): Promise<Admin> {
    const admin = repo().create(data);
    return repo().save(admin);
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
