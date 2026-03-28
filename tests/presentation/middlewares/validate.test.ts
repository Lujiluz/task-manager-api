import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { validate } from '../../../src/presentation/middlewares/validate'
import { AppError } from '../../../src/shared/errors/AppError'

const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
})

const mockRes = {} as Response

const makeReq = (body: unknown) => ({ body } as unknown as Request)

describe('validate middleware', () => {
  it('calls next() and replaces req.body with parsed data when body is valid', () => {
    const req = makeReq({ name: 'Alice', age: 30 })
    const next = vi.fn() as unknown as NextFunction

    validate(schema)(req, mockRes, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.body).toEqual({ name: 'Alice', age: 30 })
  })

  it('strips unknown fields from req.body', () => {
    const req = makeReq({ name: 'Bob', age: 25, extra: 'unwanted' })
    const next = vi.fn() as unknown as NextFunction

    validate(schema)(req, mockRes, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.body).toEqual({ name: 'Bob', age: 25 })
    expect(req.body).not.toHaveProperty('extra')
  })

  it('throws AppError with status 400 when body is invalid', () => {
    const req = makeReq({ name: '', age: -1 })
    const next = vi.fn() as unknown as NextFunction

    expect(() => validate(schema)(req, mockRes, next)).toThrow(AppError)
    expect(() => validate(schema)(req, mockRes, next)).toThrow(
      expect.objectContaining({ statusCode: 400 })
    )
  })

  it('includes Zod error messages in the thrown AppError', () => {
    const req = makeReq({ name: '', age: -1 })
    const next = vi.fn() as unknown as NextFunction

    let caught: unknown
    try {
      validate(schema)(req, mockRes, next)
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf(AppError)
    expect((caught as AppError).message).toBeTruthy()
    expect(next).not.toHaveBeenCalled()
  })

  it('throws AppError with status 400 when body is missing required fields', () => {
    const req = makeReq({})
    const next = vi.fn() as unknown as NextFunction

    expect(() => validate(schema)(req, mockRes, next)).toThrow(
      expect.objectContaining({ statusCode: 400 })
    )
    expect(next).not.toHaveBeenCalled()
  })
})
