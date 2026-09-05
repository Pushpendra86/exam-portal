import { z } from "zod";

export const addQuestionSchema = z.object({
  body: z.string().min(1, "Empty Question"),
  marks: z.number().min(1).max(4),
  options: z.array(z.string().min(1).max(256)).min(1).max(4),
  subject: z.number(),
  answer: z.string().min(1, "Invalid Answer"),
  explanation: z.string().optional(),
});

export const updateQuestionSchema = z.object({
  id: z.number(),
  body: z.string().min(1, "Empty Question"),
  marks: z.number().min(1).max(4),
  options: z.array(z.string().min(1).max(256)).min(1).max(4),
  subject: z.number(),
  answer: z.string().min(1, "Invalid Answer"),
  explanation: z.string().optional(),
});

export const searchQuestionSchema = z.object({
  query: z.string().min(1, "Empty Query"),
});

export const questionIdSchema = z.object({
  id: z.number(),
});

export const changeStatusSchema = z.object({
  id: z.number(),
  status: z.boolean(),
});

export const questionIdsSchema = z.object({
  queids: z.array(z.number()).min(1),
});
