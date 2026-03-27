import { describe, it, expect } from 'vitest';
import { AppError } from '../../../src/shared/errors/AppError';

describe('AppError', () => {
  it('extends Error', () => {
    const err = new AppError('Something failed', 400);
    expect(err).toBeInstanceOf(Error);
  });

  it('sets message correctly', () => {
    const err = new AppError('Not found', 404);
    expect(err.message).toBe('Not found');
  });

  it('sets statusCode correctly', () => {
    const err = new AppError('Forbidden', 403);
    expect(err.statusCode).toBe(403);
  });

  it('defaults isOperational to true', () => {
    const err = new AppError('Bad request', 400);
    expect(err.isOperational).toBe(true);
  });

  it('accepts isOperational: false', () => {
    const err = new AppError('Internal failure', 500, false);
    expect(err.isOperational).toBe(false);
  });

  it('has a stack trace', () => {
    const err = new AppError('Test', 400);
    expect(err.stack).toBeDefined();
  });

  it('sets the name to AppError', () => {
    const err = new AppError('Test', 400);
    expect(err.name).toBe('AppError');
  });
});
