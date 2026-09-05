import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { adminLoginSchema, userLoginSchema } from "../validators/auth.validator";

export const authRoutes = (authController: AuthController) => {
  const router = Router();

  router.post(
    "/adminlogin",
    validate(adminLoginSchema),
    authController.adminLogin
  );
  router.post(
    "/login",
    validate(userLoginSchema),
    authController.userLogin
  );

  return router;
};
