import { RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { verifyToken } from "../../shared/utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export const auth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new AppError("Unauthorized request", 401);

  const token = header.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    throw new AppError("Unauthorized request", 401);
  }
};
