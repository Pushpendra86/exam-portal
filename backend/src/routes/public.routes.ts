import { Router } from "express";
import { PublicController } from "../controllers/public.controller";
import { validate } from "../middlewares/validation.middleware";
import { registerStudentSchema } from "../validators/auth.validator";

export class PublicRoutes {
  public router = Router();

  constructor(private readonly publicController: PublicController) {
    this.routes();
  }

  private routes() {
    this.router.post(
      "/register",
      validate(registerStudentSchema),
      this.publicController.registerStudent
    );
  }
}
