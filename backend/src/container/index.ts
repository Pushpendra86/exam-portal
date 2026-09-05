import { DataSource } from "typeorm";
import { AppDataSource } from "../config/database";
import { Admin } from "../entities/admin.entity";
import { User } from "../entities/user.entity";
import { Subject } from "../entities/subject.entity";
import { Question } from "../entities/question.entity";
import { Test } from "../entities/test.entity";
import { TestRegistration } from "../entities/test-registration.entity";
import { AnswerSheet } from "../entities/answer-sheet.entity";
import { AdminRepository } from "../repositories/admin.repository";
import { UserRepository } from "../repositories/user.repository";
import { SubjectRepository } from "../repositories/subject.repository";
import { QuestionRepository } from "../repositories/question.repository";
import { TestRepository } from "../repositories/test.repository";
import { TestRegistrationRepository } from "../repositories/test-registration.repository";
import { AnswerSheetRepository } from "../repositories/answer-sheet.repository";
import { AuthService } from "../services/auth.service";
import { AdminService } from "../services/admin.service";
import { UserService } from "../services/user.service";
import { SubjectService } from "../services/subject.service";
import { QuestionService } from "../services/question.service";
import { TestService } from "../services/test.service";
import { TakeTestService } from "../services/take-test.service";
import { ResultService } from "../services/result.service";
import { AuthController } from "../controllers/auth.controller";
import { AdminController } from "../controllers/admin.controller";
import { UserController } from "../controllers/user.controller";
import { PublicController } from "../controllers/public.controller";
import { createAuthMiddleware } from "../middlewares/auth.middleware";

export class ApplicationContainer {
  readonly adminRepository: AdminRepository;
  readonly userRepository: UserRepository;
  readonly subjectRepository: SubjectRepository;
  readonly questionRepository: QuestionRepository;
  readonly testRepository: TestRepository;
  readonly testRegistrationRepository: TestRegistrationRepository;
  readonly answerSheetRepository: AnswerSheetRepository;
  readonly authService: AuthService;
  readonly adminService: AdminService;
  readonly userService: UserService;
  readonly subjectService: SubjectService;
  readonly questionService: QuestionService;
  readonly testService: TestService;
  readonly takeTestService: TakeTestService;
  readonly resultService: ResultService;
  readonly authController: AuthController;
  readonly adminController: AdminController;
  readonly userController: UserController;
  readonly publicController: PublicController;
  readonly authMiddleware: ReturnType<typeof createAuthMiddleware>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.adminRepository = new AdminRepository(dataSource.getRepository(Admin));
    this.userRepository = new UserRepository(dataSource.getRepository(User));
    this.subjectRepository = new SubjectRepository(dataSource.getRepository(Subject));
    this.questionRepository = new QuestionRepository(dataSource.getRepository(Question));
    this.testRepository = new TestRepository(dataSource.getRepository(Test));
    this.testRegistrationRepository = new TestRegistrationRepository(
      dataSource.getRepository(TestRegistration)
    );
    this.answerSheetRepository = new AnswerSheetRepository(dataSource.getRepository(AnswerSheet));

    this.authService = new AuthService(this.adminRepository, this.userRepository);
    this.adminService = new AdminService(this.userRepository, this.subjectRepository, this.authService);
    this.userService = new UserService(this.userRepository);
    this.subjectService = new SubjectService(this.subjectRepository);
    this.questionService = new QuestionService(this.questionRepository, this.subjectRepository);
    this.testService = new TestService(
      this.testRepository,
      this.questionRepository,
      this.testRegistrationRepository
    );
    this.takeTestService = new TakeTestService(
      this.testRepository,
      this.answerSheetRepository,
      this.testRegistrationRepository,
      this.questionRepository,
      this.testService
    );
    this.resultService = new ResultService(
      this.testRepository,
      this.answerSheetRepository,
      this.subjectRepository,
      this.testService
    );

    this.authController = new AuthController(this.authService);
    this.adminController = new AdminController(this.adminService, this.subjectService, this.userService);
    this.userController = new UserController(
      this.questionService,
      this.subjectService,
      this.testService,
      this.takeTestService,
      this.resultService
    );
    this.publicController = new PublicController(this.userRepository, this.authService);
    this.authMiddleware = createAuthMiddleware(this.userRepository, this.adminRepository);
  }
}