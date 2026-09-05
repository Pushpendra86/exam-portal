import dotenv from "dotenv";

dotenv.config();

class Config {
  public readonly NODE_ENV: string;
  public readonly PORT: number;
  public readonly PG_CONNECTION_STRING: string;
  public readonly JWT_SECRET: string;
  public readonly JWT_EXPIRES_IN: string;
  public readonly BCRYPT_SALT_ROUNDS: number;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || "development";
    if (this.NODE_ENV === "production" && !process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be configured in production");
    }
    this.PORT = parseInt(process.env.PORT || "5000", 10);
    this.PG_CONNECTION_STRING =
      process.env.PG_CONNECTION_STRING ||
      "postgresql://postgres:root@localhost:5432/exam_portal";
    this.JWT_SECRET = process.env.JWT_SECRET || "Examination Portal Application";
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
    this.BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  }
}

export const config = new Config();
