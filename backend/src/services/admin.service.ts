import { UserRepository } from "../repositories/user.repository";
import { SubjectRepository } from "../repositories/subject.repository";
import { AuthService } from "./auth.service";
import { AppError } from "../errors/app-error";
import { UserType } from "../entities";

export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly authService: AuthService
  ) { }

  async registerTeacher(
    username: string,
    email: string,
    password: string,
    createdBy: number
  ) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("This email is already exists!", 400);
    }
    const hashedPassword = await this.authService.hashPassword(password);
    await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      usertype: UserType.TEACHER,
      created_by: createdBy,
    });
  }

  async removeUser(id: number): Promise<boolean> {
    const success = await this.userRepository.updateStatus(id, false);
    if (!success) {
      throw new AppError("Unable to remove account", 500);
    }
    return success;
  }

  async unblockUser(id: number): Promise<boolean> {
    const success = await this.userRepository.updateStatus(id, true);
    if (!success) {
      throw new AppError("Unable to unblock account", 500);
    }
    return success;
  }

  async addSubject(name: string, createdBy: number) {
    const existing = await this.subjectRepository.findByName(name);
    if (existing) {
      throw new AppError("Subject is already exists!", 400);
    }
    await this.subjectRepository.create({ name, created_by: createdBy });
  }

  async removeSubject(id: number): Promise<boolean> {
    const success = await this.subjectRepository.updateStatus(id, false);
    if (!success) {
      throw new AppError("Unable to remove subject", 500);
    }
    return success;
  }

  async unblockSubject(id: number): Promise<boolean> {
    const success = await this.subjectRepository.updateStatus(id, true);
    if (!success) {
      throw new AppError("Unable to unblock subject", 500);
    }
    return success;
  }

  async getDashboardCount() {
    const subjectCounts = await this.subjectRepository.countByStatus();
    const userCounts = await this.userRepository.countByTypeAndStatus();

    let activeSubject = 0,
      blockedSubject = 0;
    subjectCounts.forEach((x) => {
      if (x.status) activeSubject = parseInt(String(x.count));
      if (!x.status) blockedSubject = parseInt(String(x.count));
    });

    let activeTeacher = 0,
      blockedTeacher = 0,
      activeStudent = 0,
      blockedStudent = 0;
    userCounts.forEach((x) => {
      if (x.usertype === "TEACHER" && x.status) activeTeacher = parseInt(String(x.count));
      if (x.usertype === "TEACHER" && !x.status) blockedTeacher = parseInt(String(x.count));
      if (x.usertype === "STUDENT" && x.status) activeStudent = parseInt(String(x.count));
      if (x.usertype === "STUDENT" && !x.status) blockedStudent = parseInt(String(x.count));
    });

    return {
      activeStudent,
      activeSubject,
      activeTeacher,
      blockedStudent,
      blockedSubject,
      blockedTeacher,
    };
  }
}
