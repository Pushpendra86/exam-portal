import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserRepository } from "../repositories/user.repository";
import { AdminRepository } from "../repositories/admin.repository";
import { error } from "../utils/response";

interface JwtPayload {
  _id: number;
}

interface AuthRequest extends Request {
  user?: { id: number; username: string; usertype?: string };
}

export const createAuthMiddleware = (
  userRepository: UserRepository,
  adminRepository: AdminRepository
) => {
  const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        error(res, "Authorization required", 401);
        return;
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const user = await userRepository.findById(decoded._id);
      if (!user) {
        error(res, "Authorization Failed", 401);
        return;
      }

      req.user = { id: user.id, username: user.username, usertype: user.usertype };
      next();
    } catch {
      error(res, "Invalid token", 401);
    }
  };

  const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        error(res, "Authorization required", 401);
        return;
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const admin = await adminRepository.findById(decoded._id);
      if (!admin) {
        error(res, "Authorization Failed", 401);
        return;
      }

      req.user = { id: admin.id, username: admin.username };
      next();
    } catch {
      error(res, "Invalid token", 401);
    }
  };

  return { authenticateUser, authenticateAdmin };
};

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;
