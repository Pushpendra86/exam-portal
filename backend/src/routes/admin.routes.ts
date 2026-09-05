import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import type { AuthMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { registerTeacherSchema, addSubjectSchema, idBodySchema } from "../validators/admin.validator";

export const adminRoutes = (
  adminController: AdminController,
  authMiddleware: AuthMiddleware
) => {
  const router = Router();

  router.use(authMiddleware.authenticateAdmin);

  router.get("/details", adminController.getDetails);
  router.post(
    "/register",
    validate(registerTeacherSchema),
    adminController.registerTeacher
  );
  router.post("/removeUser", adminController.removeUser);
  router.post("/unblockUser", adminController.unblockUser);
  router.post(
    "/addSubject",
    validate(addSubjectSchema),
    adminController.addSubject
  );
  router.post("/removeSubject", adminController.removeSubject);
  router.post("/unblockSubject", adminController.unblockSubject);
  router.get("/getDashboardCount", adminController.getDashboardCount);
  router.get("/getAllSubjects", adminController.getAllSubjects);
  router.get("/getSubjectCount", adminController.getSubjectCount);
  router.get("/getAllTeachers", adminController.getAllTeachers);
  router.get("/getTeacherStatusCount", adminController.getTeacherStatusCount);
  router.get("/getAllStudent", adminController.getAllStudents);

  return router;
};
