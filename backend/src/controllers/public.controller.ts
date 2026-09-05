import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { UserType } from "../entities";
import { success } from "../utils/response";
import { AppError } from "../errors/app-error";

export class PublicController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) { }

  registerStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      const existing = await this.userRepository.findByEmail(email);
      if (existing) {
        throw new AppError("This email is already exists!", 400);
      }
      const hashedPassword = await this.authService.hashPassword(password);
      await this.userRepository.create({
        username,
        email,
        password: hashedPassword,
        usertype: UserType.STUDENT,
      });
      success(res, null, "Profile created successfully!");
    } catch (err) {
      next(err);
    }
  };
}
