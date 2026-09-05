import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { AdminRepository } from "./repositories/admin.repository";
import { UserRepository } from "./repositories/user.repository";
import { SubjectRepository } from "./repositories/subject.repository";
import { QuestionRepository } from "./repositories/question.repository";
import { TestRepository } from "./repositories/test.repository";
import { TestRegistrationRepository } from "./repositories/test-registration.repository";
import { AnswerSheetRepository } from "./repositories/answer-sheet.repository";

import { AuthService } from "./services/auth.service";
import { AdminService } from "./services/admin.service";
import { UserService } from "./services/user.service";
import { SubjectService } from "./services/subject.service";
import { QuestionService } from "./services/question.service";
import { TestService } from "./services/test.service";
import { TakeTestService } from "./services/take-test.service";
import { ResultService } from "./services/result.service";

import { AuthController } from "./controllers/auth.controller";
import { AdminController } from "./controllers/admin.controller";
import { UserController } from "./controllers/user.controller";
import { PublicController } from "./controllers/public.controller";

import { AuthMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";

import { AuthRoutes } from "./routes/auth.routes";
import { AdminRoutes } from "./routes/admin.routes";
import { UserRoutes } from "./routes/user.routes";
import { PublicRoutes } from "./routes/public.routes";

export function createApp(): express.Application {
  const app = express();

  // Repositories (TypeORM-backed)
  const adminRepository = new AdminRepository();
  const userRepository = new UserRepository();
  const subjectRepository = new SubjectRepository();
  const questionRepository = new QuestionRepository();
  const testRepository = new TestRepository();
  const testRegistrationRepository = new TestRegistrationRepository();
  const answerSheetRepository = new AnswerSheetRepository();

  // Services
  const authService = new AuthService(adminRepository, userRepository);
  const adminService = new AdminService(userRepository, subjectRepository, authService);
  const userService = new UserService(userRepository);
  const subjectService = new SubjectService(subjectRepository);
  const questionService = new QuestionService(questionRepository, subjectRepository);
  const testService = new TestService(testRepository, questionRepository, testRegistrationRepository);
  const takeTestService = new TakeTestService(
    testRepository, answerSheetRepository, testRegistrationRepository,
    questionRepository, testService
  );
  const resultService = new ResultService(testRepository, answerSheetRepository, subjectRepository, testService);

  // Controllers
  const authController = new AuthController(authService);
  const adminController = new AdminController(adminService, subjectService, userService);
  const userController = new UserController(questionService, subjectService, testService, takeTestService, resultService);
  const publicController = new PublicController(userRepository, authService);

  // Middleware
  const authMiddleware = new AuthMiddleware(userRepository, adminRepository);

  // Global middleware
  app.use(helmet());
  app.use(cors({ origin: "*" }));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/v1", new AuthRoutes(authController).router);
  app.use("/api/v1/admin", new AdminRoutes(adminController, authMiddleware).router);
  app.use("/api/v1/user", new UserRoutes(userController, authMiddleware).router);
  app.use("/api/v1/public", new PublicRoutes(publicController).router);

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "Invalid API. Use the official documentation to get the list of valid APIs.",
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}
