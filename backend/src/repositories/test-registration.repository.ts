import { AppDataSource } from "../config/database";
import { TestRegistration } from "../models/test-registration.model";

const repo = () => AppDataSource.getRepository(TestRegistration);

export class TestRegistrationRepository {
  async create(data: {
    user_id: number;
    test_id: number;
  }): Promise<TestRegistration> {
    const reg = repo().create(data);
    return repo().save(reg);
  }

  async findByUserAndTest(
    userId: number,
    testId: number
  ): Promise<TestRegistration | null> {
    return repo().findOneBy({ user_id: userId, test_id: testId });
  }

  async findTestIdsByUser(userId: number): Promise<number[]> {
    const results = await repo().find({
      where: { user_id: userId },
      select: { test_id: true },
    });
    return results.map((r) => r.test_id);
  }
}
