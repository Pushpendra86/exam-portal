import { Repository } from "typeorm";
import { User, UserType } from "../entities/user.entity";

export class UserRepository {
  constructor(private readonly repository: Repository<User>) { }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async create(data: {
    username: string;
    email: string;
    usertype: UserType;
    password: string;
    created_by?: number;
  }): Promise<User> {
    const user = this.repository.create({
      ...data,
      created_by: data.created_by ?? null,
    });
    return this.repository.save(user);
  }

  async updateStatus(id: number, status: boolean): Promise<boolean> {
    const result = await this.repository.update(id, { status });
    return (result.affected ?? 0) > 0;
  }

  async findByType(usertype: UserType): Promise<User[]> {
    return this.repository.find({
      where: { usertype },
      select: { id: true, username: true, status: true },
    });
  }

  async countByTypeAndStatus(): Promise<
    { usertype: string; status: boolean; count: number }[]
  > {
    return this.repository
      .createQueryBuilder("user")
      .select("user.usertype", "usertype")
      .addSelect("user.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("user.usertype")
      .addGroupBy("user.status")
      .getRawMany();
  }
}
