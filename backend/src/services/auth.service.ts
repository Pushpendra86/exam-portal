import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AdminRepository } from "../repositories/admin.repository";
import { UserRepository } from "../repositories/user.repository";
import { Admin, User } from "../entities";
import { AppError } from "../errors/app-error";

export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly userRepository: UserRepository
  ) { }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: { _id: number }): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  async validateAdmin(username: string, password: string): Promise<Admin> {
    const admin = await this.adminRepository.findByUsername(username);
    if (!admin) {
      throw new AppError("user not found", 401);
    }
    const isValid = await this.comparePassword(password, admin.password);
    if (!isValid) {
      throw new AppError("invalid password", 401);
    }
    return admin;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("email is not registered", 401);
    }
    if (!user.status) {
      throw new AppError("your account is blocked", 401);
    }
    const isValid = await this.comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError("invalid password", 401);
    }
    return user;
  }

  async initializeAdmin(): Promise<void> {
    const hashedPassword = await this.hashPassword("systemadmin");
    await this.adminRepository.findOrCreateDefaultAdmin(
      "sysadmin",
      hashedPassword
    );
  }
}
