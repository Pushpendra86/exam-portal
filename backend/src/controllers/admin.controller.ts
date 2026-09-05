import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import { SubjectService } from "../services/subject.service";
import { UserService } from "../services/user.service";
import { ResponseHelper } from "../utils/response";

interface AuthRequest extends Request {
  user?: { id: number; username: string };
}

export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly subjectService: SubjectService,
    private readonly userService: UserService
  ) {}

  getDetails = (req: AuthRequest, res: Response) => {
    if (req.user) {
      ResponseHelper.success(res, {
        username: req.user.username,
        _id: req.user.id,
      });
    } else {
      ResponseHelper.error(res, "Not authenticated", 401);
    }
  };

  registerTeacher = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      if (!req.user) {
        ResponseHelper.error(res, "Permissions not granted!", 401);
        return;
      }
      await this.adminService.registerTeacher(username, email, password, req.user.id);
      ResponseHelper.success(res, null, "Profile created successfully!");
    } catch (err) {
      next(err);
    }
  };

  removeUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.adminService.removeUser(req.body._id);
      ResponseHelper.success(res, null, "Account has been removed");
    } catch (err) {
      next(err);
    }
  };

  unblockUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.adminService.unblockUser(req.body._id);
      ResponseHelper.success(res, null, "Account has been unblocked");
    } catch (err) {
      next(err);
    }
  };

  addSubject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        ResponseHelper.error(res, "Permissions not granted!", 401);
        return;
      }
      await this.adminService.addSubject(req.body.name, req.user.id);
      ResponseHelper.success(res, null, "Subject created successfully!");
    } catch (err) {
      next(err);
    }
  };

  removeSubject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.adminService.removeSubject(req.body._id);
      ResponseHelper.success(res, null, "Subject has been removed");
    } catch (err) {
      next(err);
    }
  };

  unblockSubject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.adminService.unblockSubject(req.body._id);
      ResponseHelper.success(res, null, "Subject has been unblocked");
    } catch (err) {
      next(err);
    }
  };

  getDashboardCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const counts = await this.adminService.getDashboardCount();
      ResponseHelper.success(res, counts);
    } catch (err) {
      next(err);
    }
  };

  getAllSubjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const subjects = await this.subjectService.getAllSubjects();
      ResponseHelper.success(res, { subjects });
    } catch (err) {
      next(err);
    }
  };

  getSubjectCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const counts = await this.subjectService.getStatusCount();
      ResponseHelper.success(res, counts);
    } catch (err) {
      next(err);
    }
  };

  getAllTeachers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const teachers = await this.userService.getAllTeachers();
      ResponseHelper.success(res, { teachers });
    } catch (err) {
      next(err);
    }
  };

  getTeacherStatusCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const counts = await this.userService.getTeacherStatusCount();
      ResponseHelper.success(res, counts);
    } catch (err) {
      next(err);
    }
  };

  getAllStudents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const students = await this.userService.getAllStudents();
      ResponseHelper.success(res, { students });
    } catch (err) {
      next(err);
    }
  };
}
