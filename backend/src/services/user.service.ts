import { UserRepository } from "../repositories/user.repository";
import { UserType } from "../entities";

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getAllTeachers() {
    const teachers = await this.userRepository.findByType(UserType.TEACHER);
    return teachers.map((t) => ({
      id: t.id,
      name: t.username,
      status: t.status,
    }));
  }

  async getAllStudents() {
    const students = await this.userRepository.findByType(UserType.STUDENT);
    return students.map((s) => ({
      id: s.id,
      name: s.username,
      status: s.status,
    }));
  }

  async getTeacherStatusCount() {
    const counts = await this.userRepository.countByTypeAndStatus();
    let active = 0,
      blocked = 0;
    counts.forEach((x) => {
      if (x.usertype === "TEACHER" && x.status) active = parseInt(String(x.count));
      if (x.usertype === "TEACHER" && !x.status) blocked = parseInt(String(x.count));
    });
    return { active, blocked };
  }
}
