export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(
    message: string,
    public readonly statusCode: number,
    isOperational = true
  ) {
    super(message);
    this.name = "AppError";
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}