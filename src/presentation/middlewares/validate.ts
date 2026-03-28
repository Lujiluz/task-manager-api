import { RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      throw new AppError(message, 400);
    }
    req.body = result.data;
    next();
  };
