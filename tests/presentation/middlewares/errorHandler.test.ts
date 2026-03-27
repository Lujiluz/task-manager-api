import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// Both mocks must be at module top level so Vitest can hoist them
vi.mock('../../../src/shared/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { logger } from '../../../src/shared/logger';

vi.mock('../../../src/config', () => ({
  config: { nodeEnv: 'test', port: 3000, databaseUrl: 'postgresql://test' },
}));

import { AppError } from '../../../src/shared/errors/AppError';
import { errorHandler } from '../../../src/presentation/middlewares/errorHandler';

const mockReq = {} as Request;
const mockNext = vi.fn() as unknown as NextFunction;

const makeRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AppError handling', () => {
    it('returns the AppError statusCode and message', () => {
      const res = makeRes();
      const err = new AppError('Not found', 404);
      errorHandler(err, mockReq, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', message: 'Not found' })
      );
    });

    it('returns 409 for a conflict AppError', () => {
      const res = makeRes();
      const err = new AppError('Email already taken', 409);
      errorHandler(err, mockReq, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', message: 'Email already taken' })
      );
    });

    it('returns 500 and generic message for a non-operational AppError', () => {
      const res = makeRes();
      const err = new AppError('Something broke internally', 500, false);
      errorHandler(err, mockReq, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Internal Server Error' })
      );
      expect(logger.error).toHaveBeenCalledOnce();
    });
  });

  describe('Unknown error handling', () => {
    it('returns 500 for an unknown Error', () => {
      const res = makeRes();
      const err = new Error('Something unexpected');
      errorHandler(err, mockReq, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'error', message: 'Internal Server Error' })
      );
      expect(logger.error).toHaveBeenCalledOnce();
    });

    it('returns 500 for a non-Error thrown value', () => {
      const res = makeRes();
      errorHandler('a string was thrown', mockReq, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
