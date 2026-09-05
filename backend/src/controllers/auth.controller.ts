import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ResponseHelper } from "../utils/response";
import { AppError } from "../utils/app-error";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const admin = await this.authService.validateAdmin(username, password);
      const token = this.authService.generateToken({ _id: admin.id });
      ResponseHelper.success(res, {
        admin: { username: admin.username, _id: admin.id },
        token,
      }, "login successful");
    } catch (err) {
      next(err);
    }
  };

  userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.validateUser(email, password);
      const token = this.authService.generateToken({ _id: user.id });
      ResponseHelper.success(res, {
        user: {
          username: user.username,
          type: user.usertype,
          _id: user.id,
          email: user.email,
        },
        token,
      }, "login successful");
    } catch (err) {
      next(err);
    }
  };
}
