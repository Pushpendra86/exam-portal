import { Repository } from "typeorm";
import { TestRegistration } from "../entities/test-registration.entity";

export class TestRegistrationRepository {
  constructor(private readonly repository: Repository<TestRegistration>) { }

  async create(data: {
    user_id: number;
    test_id: number;
  }): Promise<TestRegistration> {
    const reg = this.repository.create(data);
    return this.repository.save(reg);
  }

  async findByUserAndTest(
    userId: number,
    testId: number
  ): Promise<TestRegistration | null> {
    return this.repository.findOneBy({ user_id: userId, test_id: testId });
  }

  async findTestIdsByUser(userId: number): Promise<number[]> {
    const results = await this.repository.find({
      where: { user_id: userId },
      select: { test_id: true },
    });
    return results.map((r) => r.test_id);
  }
}
