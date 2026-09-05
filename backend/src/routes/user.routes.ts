import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { registerStudentSchema } from "../validators/auth.validator";
import {
  addQuestionSchema,
  updateQuestionSchema,
  searchQuestionSchema,
  changeStatusSchema,
  questionIdSchema,
  questionIdsSchema,
} from "../validators/question.validator";
import {
  createTestSchema,
  testIdSchema,
  testRegistrationSchema,
  startTestSchema,
  questionsStartTimeSchema,
  saveAnswerSchema,
  endTestSchema,
} from "../validators/test.validator";

export class UserRoutes {
  public router = Router();

  constructor(
    private readonly userController: UserController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.routes();
  }

  private routes() {
    this.router.use(this.authMiddleware.authenticateUser);

    // Common
    this.router.get("/details", this.userController.getDetails);

    // Test (common)
    this.router.get("/getAllTest", this.userController.getAllTest);
    this.router.post("/getTestById", this.userController.getTestById);

    // Teacher endpoints
    this.router.post(
      "/addQuestion",
      validate(addQuestionSchema),
      this.userController.addQuestion
    );
    this.router.get("/getAllSubjects", this.userController.getAllSubjects);
    this.router.post(
      "/searchQuestion",
      validate(searchQuestionSchema),
      this.userController.searchQuestion
    );
    this.router.post(
      "/updateQuestion",
      validate(updateQuestionSchema),
      this.userController.updateQuestion
    );
    this.router.post(
      "/changeQuestionStatus",
      validate(changeStatusSchema),
      this.userController.changeQuestionStatus
    );
    this.router.post(
      "/getAnswer",
      validate(questionIdSchema),
      this.userController.getAnswer
    );
    this.router.post(
      "/getQuestionAnswer",
      validate(questionIdSchema),
      this.userController.getQuestionAnswer
    );
    this.router.post(
      "/createTest",
      validate(createTestSchema),
      this.userController.createTest
    );

    // Student endpoints
    this.router.post(
      "/testRegistration",
      validate(testRegistrationSchema),
      this.userController.testRegistration
    );
    this.router.get("/getAllTestStudent", this.userController.getAllTestStudent);
    this.router.get("/getUpcomingTests", this.userController.getUpcomingTests);

    this.router.post(
      "/startTest",
      validate(startTestSchema),
      this.userController.startTest
    );
    this.router.post(
      "/getQuenStarttime",
      validate(questionsStartTimeSchema),
      this.userController.getQuestionStartTime
    );
    this.router.post(
      "/saveAnswer",
      validate(saveAnswerSchema),
      this.userController.saveAnswer
    );
    this.router.post(
      "/endTest",
      validate(endTestSchema),
      this.userController.endTest
    );

    this.router.get("/getAllCompletedTest", this.userController.getAllCompletedTest);
    this.router.post(
      "/getResultMainDetailsByTestId",
      validate(testIdSchema),
      this.userController.getResultDetails
    );
    this.router.post(
      "/getQuestionAnswerByIds",
      validate(questionIdsSchema),
      this.userController.getQuestionAnswerByIds
    );
  }
}
