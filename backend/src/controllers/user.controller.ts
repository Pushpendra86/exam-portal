import { Request, Response, NextFunction } from "express";
import { QuestionService } from "../services/question.service";
import { SubjectService } from "../services/subject.service";
import { TestService } from "../services/test.service";
import { TakeTestService } from "../services/take-test.service";
import { ResultService } from "../services/result.service";
import { success, error } from "../utils/response";

interface AuthRequest extends Request {
  user?: { id: number; username: string; usertype: string };
}

export class UserController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly subjectService: SubjectService,
    private readonly testService: TestService,
    private readonly takeTestService: TakeTestService,
    private readonly resultService: ResultService
  ) { }

  getDetails = (req: AuthRequest, res: Response) => {
    if (req.user) {
      success(res, {
        username: req.user.username,
        type: req.user.usertype,
        _id: req.user.id,
      });
    } else {
      error(res, "Not authenticated", 401);
    }
  };

  getAllTest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const testlist = await this.testService.getAllTests();
      success(res, { testlist });
    } catch (err) {
      next(err);
    }
  };

  getTestById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const test = await this.testService.getTestDetails(
        req.body.testid,
        req.user?.usertype || ""
      );
      success(res, { test });
    } catch (err) {
      next(err);
    }
  };

  // Teacher endpoints
  addQuestion = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "TEACHER") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      await this.questionService.addQuestion({
        body: req.body.body,
        explanation: req.body.explanation,
        options: req.body.options,
        subject: req.body.subject,
        answer: req.body.answer,
        marks: req.body.marks,
        createdBy: req.user.id,
      });
      success(res, null, "Question created successfully!");
    } catch (err) {
      next(err);
    }
  };

  getAllSubjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const subjects = await this.subjectService.getActiveSubjects();
      success(res, { subjects });
    } catch (err) {
      next(err);
    }
  };

  searchQuestion = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "TEACHER") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const list = await this.questionService.searchQuestions(req.body.query);
      success(res, { list });
    } catch (err) {
      next(err);
    }
  };

  updateQuestion = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "TEACHER") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      await this.questionService.updateQuestion(req.body.id, {
        body: req.body.body,
        explanation: req.body.explanation,
        options: req.body.options,
        subject: req.body.subject,
        answer: req.body.answer,
        marks: req.body.marks,
        createdBy: req.user.id,
      });
      success(res, null, "Question updated");
    } catch (err) {
      next(err);
    }
  };

  changeQuestionStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "TEACHER") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      await this.questionService.changeStatus(
        req.body.id,
        req.body.status,
        req.user.id
      );
      success(res, null, "Status changed");
    } catch (err) {
      next(err);
    }
  };

  getAnswer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "TEACHER") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const result = await this.questionService.getAnswerByQuestionId(req.body.id);
      success(res, result);
    } catch (err) {
      next(err);
    }
  };

  getQuestionAnswer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "TEACHER") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const question = await this.questionService.getQuestionById(req.body.id);
      success(res, { question, answer: question.answer });
    } catch (err) {
      next(err);
    }
  };

  createTest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "TEACHER") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      await this.testService.createTest({
        title: req.body.title,
        subjects: req.body.subjects,
        maxmarks: req.body.maxmarks,
        queTypes: req.body.queTypes,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        duration: req.body.duration,
        regStartTime: req.body.regStartTime,
        regEndTime: req.body.regEndTime,
        resultTime: req.body.resultTime,
        createdBy: req.user.id,
      });
      success(res, null, "Test created successfully!");
    } catch (err) {
      next(err);
    }
  };

  // Student endpoints
  testRegistration = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      await this.testService.testRegistration(req.user.id, req.body.testid);
      success(res, null, "Test Registration success");
    } catch (err) {
      next(err);
    }
  };

  getAllTestStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const testlist = await this.testService.getAllTestsWithRegistrationCheck(req.user.id);
      success(res, { testlist });
    } catch (err) {
      next(err);
    }
  };

  getUpcomingTests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const upcomingtestlist = await this.testService.getUpcomingTests(req.user.id);
      success(res, { upcomingtestlist });
    } catch (err) {
      next(err);
    }
  };

  startTest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const result = await this.takeTestService.startTest(req.user.id, req.body.testid);
      success(res, result);
    } catch (err) {
      next(err);
    }
  };

  getQuestionStartTime = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const result = await this.takeTestService.getQuestionsWithStartTime(
        req.user.id,
        req.body.answersheetid,
        req.body.questionid,
        req.body.addStartTime
      );
      success(res, result);
    } catch (err) {
      next(err);
    }
  };

  saveAnswer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const result = await this.takeTestService.saveAnswer(
        req.user.id,
        req.body.answersheetid,
        req.body.answers
      );
      success(res, {
        testDone: result.testDone,
      }, result.testDone ? "Test is completed" : "answers updated");
    } catch (err) {
      next(err);
    }
  };

  endTest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      await this.takeTestService.endTest(
        req.user.id,
        req.body.answersheetid,
        req.body.answers
      );
      success(res, null, "Test is completed");
    } catch (err) {
      next(err);
    }
  };

  getAllCompletedTest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const completedtestlist = await this.resultService.getCompletedTests(req.user.id);
      success(res, { completedtestlist });
    } catch (err) {
      next(err);
    }
  };

  getResultDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.usertype !== "STUDENT") {
        error(res, "Answer sheet not found", 404);
        return;
      }
      const result = await this.resultService.getResultDetails(
        req.user.id,
        req.body.testid
      );
      if (!result) {
        error(res, "Answer sheet not found", 404);
        return;
      }
      success(res, { result });
    } catch (err) {
      next(err);
    }
  };

  getQuestionAnswerByIds = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        error(res, "Permissions not granted!", 401);
        return;
      }
      const questions = await this.questionService.getQuestionsByIds(req.body.queids);
      success(res, { questions });
    } catch (err) {
      next(err);
    }
  };
}
