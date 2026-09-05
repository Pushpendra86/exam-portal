import { z } from "zod";

export const createTestSchema = z.object({
  title: z.string().min(1, "Empty Title"),
  subjects: z.array(z.number()).min(1),
  maxmarks: z.number().min(1),
  queTypes: z.array(z.number()).min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  duration: z.number().min(1),
  regStartTime: z.string().min(1),
  regEndTime: z.string().min(1),
  resultTime: z.string().min(1),
});

export const testIdSchema = z.object({
  testid: z.number({ error: "test id is required" }),
});

export const testRegistrationSchema = z.object({
  testid: z.number({ error: "test id is required" }),
});

export const startTestSchema = z.object({
  testid: z.number({ error: "test id is required" }),
});

export const questionsStartTimeSchema = z.object({
  addStartTime: z.boolean(),
  answersheetid: z.number(),
  questionid: z.array(z.number()).min(1),
});

export const saveAnswerSchema = z.object({
  answersheetid: z.number(),
  answers: z.array(z.string().nullable()).min(1),
});

export const endTestSchema = z.object({
  answersheetid: z.number(),
  answers: z.array(z.string().nullable()).min(1),
});
