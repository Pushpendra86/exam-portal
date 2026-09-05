import { SubjectRepository } from "../repositories/subject.repository";

export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async getAllSubjects() {
    const subjects = await this.subjectRepository.findAll();
    return subjects.map((s) => ({
      id: s.id,
      subject: s.name,
      status: s.status,
    }));
  }

  async getActiveSubjects() {
    const subjects = await this.subjectRepository.findActive();
    return subjects.map((s) => ({
      id: s.id,
      subject: s.name,
      status: s.status,
    }));
  }

  async getStatusCount() {
    const counts = await this.subjectRepository.countByStatus();
    let active = 0,
      blocked = 0;
    counts.forEach((x) => {
      if (x.status) active = parseInt(String(x.count));
      if (!x.status) blocked = parseInt(String(x.count));
    });
    return { active, blocked };
  }
}
