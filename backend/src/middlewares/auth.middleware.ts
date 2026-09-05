import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserRepository } from "../repositories/user.repository";
import { AdminRepository } from "../repositories/admin.repository";
import { ResponseHelper } from "../utils/response";

interface JwtPayload {
  _id: number;
}

interface AuthRequest extends Request {
  user?: { id: number; username: string; usertype?: string };
}

export class AuthMiddleware {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository
  ) {}

  authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        ResponseHelper.error(res, "Authorization required", 401);
        return;
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const user = await this.userRepository.findById(decoded._id);
      if (!user) {
        ResponseHelper.error(res, "Authorization Failed", 401);
        return;
      }

      req.user = { id: user.id, username: user.username, usertype: user.usertype };
      next();
    } catch {
      ResponseHelper.error(res, "Invalid token", 401);
    }
  };

  authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        ResponseHelper.error(res, "Authorization required", 401);
        return;
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const admin = await this.adminRepository.findById(decoded._id);
      if (!admin) {
        ResponseHelper.error(res, "Authorization Failed", 401);
        return;
      }

      req.user = { id: admin.id, username: admin.username };
      next();
    } catch {
      ResponseHelper.error(res, "Invalid token", 401);
    }
  };
}
