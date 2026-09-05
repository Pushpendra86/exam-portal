import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export class ResponseHelper {
  static success<T>(res: Response, data: T, message = "Success", statusCode = 200): void {
    const response: ApiResponse<T> = { success: true, message, data };
    res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode = 500, errors?: unknown[]): void {
    const response: ApiResponse = { success: false, message, errors };
    res.status(statusCode).json(response);
  }
}
