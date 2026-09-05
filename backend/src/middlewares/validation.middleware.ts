import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { error } from "../utils/response";

type ZodSchema = z.ZodType;

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

function isZodSchema(val: unknown): val is ZodSchema {
  return val !== null && typeof val === "object" && "_zod" in (val as Record<string, unknown>);
}

export const validate = (schemas: ZodSchema | ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isZodSchema(schemas)) {
        const result = (schemas as ZodSchema).safeParse(req.body);
        if (!result.success) throw result.error;
        req.body = result.data;
      } else {
        const s = schemas as ValidationSchemas;
        if (s.body) {
          const result = s.body.safeParse(req.body);
          if (!result.success) throw result.error;
          req.body = result.data;
        }
        if (s.query) {
          const result = s.query.safeParse(req.query);
          if (!result.success) throw result.error;
          req.query = result.data as any;
        }
        if (s.params) {
          const result = s.params.safeParse(req.params);
          if (!result.success) throw result.error;
          req.params = result.data as any;
        }
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        error(res, "Validation failed", 400, errors);
        return;
      }
      next(err);
    }
  };
};
