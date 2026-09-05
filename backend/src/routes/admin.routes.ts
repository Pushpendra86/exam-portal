import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { registerTeacherSchema, addSubjectSchema, idBodySchema } from "../validators/admin.validator";

export class AdminRoutes {
  public router = Router();

  constructor(
    private readonly adminController: AdminController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.routes();
  }

  private routes() {
    this.router.use(this.authMiddleware.authenticateAdmin);

    this.router.get("/details", this.adminController.getDetails);
    this.router.post(
      "/register",
      validate(registerTeacherSchema),
      this.adminController.registerTeacher
    );
    this.router.post("/removeUser", this.adminController.removeUser);
    this.router.post("/unblockUser", this.adminController.unblockUser);
    this.router.post(
      "/addSubject",
      validate(addSubjectSchema),
      this.adminController.addSubject
    );
    this.router.post("/removeSubject", this.adminController.removeSubject);
    this.router.post("/unblockSubject", this.adminController.unblockSubject);
    this.router.get("/getDashboardCount", this.adminController.getDashboardCount);
    this.router.get("/getAllSubjects", this.adminController.getAllSubjects);
    this.router.get("/getSubjectCount", this.adminController.getSubjectCount);
    this.router.get("/getAllTeachers", this.adminController.getAllTeachers);
    this.router.get("/getTeacherStatusCount", this.adminController.getTeacherStatusCount);
    this.router.get("/getAllStudent", this.adminController.getAllStudents);
  }
}
