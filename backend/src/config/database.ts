import { DataSource } from "typeorm";
import { config } from "./index";
import { Admin } from "../models/admin.model";
import { User } from "../models/user.model";
import { Subject } from "../models/subject.model";
import { Question } from "../models/question.model";
import { Test } from "../models/test.model";
import { TestRegistration } from "../models/test-registration.model";
import { AnswerSheet } from "../models/answer-sheet.model";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: config.PG_CONNECTION_STRING,
  synchronize: true,
  logging: config.NODE_ENV === "development",
  entities: [Admin, User, Subject, Question, Test, TestRegistration, AnswerSheet],
});

export async function initializeDatabase(): Promise<void> {
  await AppDataSource.initialize();
  console.log("Database connected and initialized with TypeORM");
}
