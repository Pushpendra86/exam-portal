import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Invalid username"),
  password: z.string().min(4, "Invalid password").max(20),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Invalid password").max(20),
});

export const registerStudentSchema = z.object({
  username: z.string().min(1, "Invalid name"),
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(5, "Invalid Password").max(20),
});
