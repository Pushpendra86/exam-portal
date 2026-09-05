import { DataSource } from "typeorm";
import { config } from "./index";
import { Admin } from "../entities/admin.entity";
import { User } from "../entities/user.entity";
import { Subject } from "../entities/subject.entity";
import { Question } from "../entities/question.entity";
import { Test } from "../entities/test.entity";
import { TestRegistration } from "../entities/test-registration.entity";
import { AnswerSheet } from "../entities/answer-sheet.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: config.PG_CONNECTION_STRING,
  synchronize: config.NODE_ENV !== "production",
  logging: config.NODE_ENV === "development",
  entities: [Admin, User, Subject, Question, Test, TestRegistration, AnswerSheet],
});

export async function initializeDatabase(): Promise<void> {
  await AppDataSource.initialize();
  console.log("Database connected and initialized with TypeORM");
}
