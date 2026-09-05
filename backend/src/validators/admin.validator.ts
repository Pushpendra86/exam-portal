import { z } from "zod";

export const registerTeacherSchema = z.object({
  username: z.string().min(1, "Invalid name"),
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(5, "Invalid Password").max(20),
});

export const addSubjectSchema = z.object({
  name: z.string().min(1, "Invalid name"),
});

export const idBodySchema = z.object({
  _id: z.number({ error: "ID is required" }),
});
