import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import type { AuthMiddleware } from "../middlewares/auth.middleware";
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

export const userRoutes = (
  userController: UserController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  router.use(authMiddleware.authenticateUser);

  // Common
  router.get("/details", userController.getDetails);

  // Test (common)
  router.get("/getAllTest", userController.getAllTest);
  router.post("/getTestById", userController.getTestById);

  // Teacher endpoints
  router.post(
    "/addQuestion",
    validate(addQuestionSchema),
    userController.addQuestion
  );
  router.get("/getAllSubjects", userController.getAllSubjects);
  router.post(
    "/searchQuestion",
    validate(searchQuestionSchema),
    userController.searchQuestion
  );
  router.post(
    "/updateQuestion",
    validate(updateQuestionSchema),
    userController.updateQuestion
  );
  router.post(
    "/changeQuestionStatus",
    validate(changeStatusSchema),
    userController.changeQuestionStatus
  );
  router.post(
    "/getAnswer",
    validate(questionIdSchema),
    userController.getAnswer
  );
  router.post(
    "/getQuestionAnswer",
    validate(questionIdSchema),
    userController.getQuestionAnswer
  );
  router.post(
    "/createTest",
    validate(createTestSchema),
    userController.createTest
  );

  // Student endpoints
  router.post(
    "/testRegistration",
    validate(testRegistrationSchema),
    userController.testRegistration
  );
  router.get("/getAllTestStudent", userController.getAllTestStudent);
  router.get("/getUpcomingTests", userController.getUpcomingTests);

  router.post(
    "/startTest",
    validate(startTestSchema),
    userController.startTest
  );
  router.post(
    "/getQuenStarttime",
    validate(questionsStartTimeSchema),
    userController.getQuestionStartTime
  );
  router.post(
    "/saveAnswer",
    validate(saveAnswerSchema),
    userController.saveAnswer
  );
  router.post(
    "/endTest",
    validate(endTestSchema),
    userController.endTest
  );

  router.get("/getAllCompletedTest", userController.getAllCompletedTest);
  router.post(
    "/getResultMainDetailsByTestId",
    validate(testIdSchema),
    userController.getResultDetails
  );
  router.post(
    "/getQuestionAnswerByIds",
    validate(questionIdsSchema),
    userController.getQuestionAnswerByIds
  );

  return router;
};
