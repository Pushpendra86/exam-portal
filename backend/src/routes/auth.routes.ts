import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { adminLoginSchema, userLoginSchema } from "../validators/auth.validator";

export class AuthRoutes {
  public router = Router();

  constructor(private readonly authController: AuthController) {
    this.routes();
  }

  private routes() {
    this.router.post(
      "/adminlogin",
      validate(adminLoginSchema),
      this.authController.adminLogin
    );
    this.router.post(
      "/login",
      validate(userLoginSchema),
      this.authController.userLogin
    );
  }
}
