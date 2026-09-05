import { Router } from "express";

// Repositories
import { AdminRepository } from "../repositories/admin.repository";
import { UserRepository } from "../repositories/user.repository";
import { SubjectRepository } from "../repositories/subject.repository";
import { QuestionRepository } from "../repositories/question.repository";
import { TestRepository } from "../repositories/test.repository";
import { TestRegistrationRepository } from "../repositories/test-registration.repository";
import { AnswerSheetRepository } from "../repositories/answer-sheet.repository";

// Services
import { AuthService } from "../services/auth.service";
import { AdminService } from "../services/admin.service";
import { UserService } from "../services/user.service";
import { SubjectService } from "../services/subject.service";
import { QuestionService } from "../services/question.service";
import { TestService } from "../services/test.service";
import { TakeTestService } from "../services/take-test.service";
import { ResultService } from "../services/result.service";

// Controllers
import { AuthController } from "../controllers/auth.controller";
import { AdminController } from "../controllers/admin.controller";
import { UserController } from "../controllers/user.controller";
import { PublicController } from "../controllers/public.controller";

// Repositories
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

// Router
const router = Router();

// ─── Public ────────────────────────────────────────────
router.post("/public/register", publicController.registerStudent);

// ─── Auth ──────────────────────────────────────────────
router.post("/login", authController.userLogin);
router.post("/adminlogin", authController.adminLogin);

// ─── Admin ─────────────────────────────────────────────
router.get("/admin/details", adminController.getDetails);
router.post("/admin/register", adminController.registerTeacher);
router.post("/admin/removeUser", adminController.removeUser);
router.post("/admin/unblockUser", adminController.unblockUser);
router.post("/admin/addSubject", adminController.addSubject);
router.post("/admin/removeSubject", adminController.removeSubject);
router.post("/admin/unblockSubject", adminController.unblockSubject);
router.get("/admin/getDashboardCount", adminController.getDashboardCount);
router.get("/admin/getAllSubjects", adminController.getAllSubjects);
router.get("/admin/getSubjectCount", adminController.getSubjectCount);
router.get("/admin/getAllTeachers", adminController.getAllTeachers);
router.get("/admin/getTeacherStatusCount", adminController.getTeacherStatusCount);
router.get("/admin/getAllStudent", adminController.getAllStudents);

// ─── User (Teacher + Student) ──────────────────────────
router.get("/user/details", userController.getDetails);

// Tests (common)
router.get("/user/getAllTest", userController.getAllTest);
router.post("/user/getTestById", userController.getTestById);

// Teacher endpoints
router.post("/user/addQuestion", userController.addQuestion);
router.get("/user/getAllSubjects", userController.getAllSubjects);
router.post("/user/searchQuestion", userController.searchQuestion);
router.post("/user/updateQuestion", userController.updateQuestion);
router.post("/user/changeQuestionStatus", userController.changeQuestionStatus);
router.post("/user/getAnswer", userController.getAnswer);
router.post("/user/getQuestionAnswer", userController.getQuestionAnswer);
router.post("/user/createTest", userController.createTest);

// Student endpoints
router.post("/user/testRegistration", userController.testRegistration);
router.get("/user/getAllTestStudent", userController.getAllTestStudent);
router.get("/user/getUpcomingTests", userController.getUpcomingTests);
router.post("/user/startTest", userController.startTest);
router.post("/user/getQuenStarttime", userController.getQuestionStartTime);
router.post("/user/saveAnswer", userController.saveAnswer);
router.post("/user/endTest", userController.endTest);
router.get("/user/getAllCompletedTest", userController.getAllCompletedTest);
router.post("/user/getResultMainDetailsByTestId", userController.getResultDetails);
router.post("/user/getQuestionAnswerByIds", userController.getQuestionAnswerByIds);

export default router;
