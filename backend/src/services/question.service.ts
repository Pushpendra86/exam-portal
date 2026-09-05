import { QuestionRepository } from "../repositories/question.repository";
import { SubjectRepository } from "../repositories/subject.repository";
import { AppError } from "../utils/app-error";

export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly subjectRepository: SubjectRepository
  ) {}

  async addQuestion(data: {
    body: string;
    explanation?: string;
    options: string[];
    subject: number;
    answer: string;
    marks: number;
    createdBy: number;
  }) {
    if (!data.options.includes(data.answer)) {
      throw new AppError("Answer is not in list of options", 400);
    }
    const subject = await this.subjectRepository.findById(data.subject);
    if (!subject || !subject.status) {
      throw new AppError("Subject not found", 400);
    }
    await this.questionRepository.create({
      body: data.body,
      explanation: data.explanation,
      options: data.options,
      subject: data.subject,
      answer: data.answer,
      marks: data.marks,
      created_by: data.createdBy,
    });
  }

  async searchQuestions(query: string) {
    const questions = await this.questionRepository.searchByBody(query);
    return questions.map((q) => ({
      _id: q.id,
      body: q.body,
      status: q.status,
    }));
  }

  async updateQuestion(id: number, data: {
    body: string;
    explanation?: string;
    options: string[];
    subject: number;
    answer: string;
    marks: number;
    createdBy: number;
  }) {
    if (!data.options.includes(data.answer)) {
      throw new AppError("Answer is not in list of options", 400);
    }
    const success = await this.questionRepository.update(id, {
      body: data.body,
      explanation: data.explanation,
      options: data.options,
      subject: data.subject,
      answer: data.answer,
      marks: data.marks,
      created_by: data.createdBy,
    });
    if (!success) {
      throw new AppError("Question not found or not updated", 404);
    }
  }

  async getQuestionById(id: number) {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new AppError("Question not found", 404);
    }
    return {
      _id: question.id,
      body: question.body,
      explanation: question.explanation,
      options: question.options,
      subject: question.subject,
      answer: question.answer,
      marks: question.marks,
      status: question.status,
      createdBy: question.created_by,
    };
  }

  async getAnswerByQuestionId(id: number) {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new AppError("Question not found", 404);
    }
    return { answer: question.answer };
  }

  async changeStatus(id: number, status: boolean, createdBy: number) {
    const success = await this.questionRepository.updateStatus(id, status, createdBy);
    if (!success) {
      throw new AppError("Question not found", 404);
    }
  }

  async getQuestionsByIds(ids: number[]) {
    const questions = await this.questionRepository.findByIds(ids);
    if (questions.length < ids.length) {
      throw new AppError("Not all questions found", 404);
    }
    const ordered = ids.map((id) => {
      const q = questions.find((ques) => ques.id === id);
      return q
        ? {
            _id: q.id,
            body: q.body,
            options: q.options,
            marks: q.marks,
            answer: q.answer,
            explanation: q.explanation,
          }
        : null;
    }).filter(Boolean);
    return ordered;
  }
}
