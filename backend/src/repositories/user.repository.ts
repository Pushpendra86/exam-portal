import { AppDataSource } from "../config/database";
import { User, UserType } from "../models/user.model";

const repo = () => AppDataSource.getRepository(User);

export class UserRepository {
  async findById(id: number): Promise<User | null> {
    return repo().findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return repo().findOneBy({ email });
  }

  async create(data: {
    username: string;
    email: string;
    usertype: UserType;
    password: string;
    created_by?: number;
  }): Promise<User> {
    const user = repo().create({
      ...data,
      created_by: data.created_by ?? null,
    });
    return repo().save(user);
  }

  async updateStatus(id: number, status: boolean): Promise<boolean> {
    const result = await repo().update(id, { status });
    return (result.affected ?? 0) > 0;
  }

  async findByType(usertype: UserType): Promise<User[]> {
    return repo().find({
      where: { usertype },
      select: { id: true, username: true, status: true },
    });
  }

  async countByTypeAndStatus(): Promise<
    { usertype: string; status: boolean; count: number }[]
  > {
    return repo()
      .createQueryBuilder("user")
      .select("user.usertype", "usertype")
      .addSelect("user.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("user.usertype")
      .addGroupBy("user.status")
      .getRawMany();
  }
}
