import { ErrorRequestHandler } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { logger } from '../../shared/logger';
import { config } from '../../config';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // AppError — expected, operational errors
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err }, 'Non-operational AppError');
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
      });
      return;
    }

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Prisma errors — activated once @prisma/client is installed and prisma generate is run.
  // TODO: Uncomment this block after: npm install @prisma/client && npx prisma generate
  //
  // import { Prisma } from '@prisma/client';
  //
  // if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //   const prismaErrorMap: Record<string, { status: number; message: string }> = {
  //     P2002: { status: 409, message: 'A record with this value already exists.' },
  //     P2025: { status: 404, message: 'Record not found.' },
  //     P2003: { status: 409, message: 'Operation violates a relational constraint.' },
  //     P2000: { status: 400, message: 'The provided value is too long.' },
  //   };
  //   const mapped = prismaErrorMap[err.code] ?? { status: 500, message: 'Database error.' };
  //   res.status(mapped.status).json({ status: 'error', message: mapped.message });
  //   return;
  // }
  //
  // if (err instanceof Prisma.PrismaClientValidationError) {
  //   res.status(400).json({ status: 'error', message: 'Invalid request data.' });
  //   return;
  // }

  // Unknown errors — log fully, never leak internals
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    ...(config.nodeEnv === 'development' && { stack: err instanceof Error ? err.stack : undefined }),
  });
};
