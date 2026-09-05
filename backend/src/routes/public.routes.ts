import { Router } from "express";
import { PublicController } from "../controllers/public.controller";
import { validate } from "../middlewares/validation.middleware";
import { registerStudentSchema } from "../validators/auth.validator";

export const publicRoutes = (publicController: PublicController) => {
  const router = Router();

  router.post(
    "/register",
    validate(registerStudentSchema),
    publicController.registerStudent
  );

  return router;
};
