import { describe, it, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../../../src/config', () => ({
  config: {
    nodeEnv: 'test',
    port: 3000,
    databaseUrl: 'postgresql://test',
    jwtSecret: 'test-jwt-secret',
  },
}))

import { signToken } from '../../../src/shared/utils/jwt'
import { auth } from '../../../src/presentation/middlewares/auth'
import { AppError } from '../../../src/shared/errors/AppError'

const makeReq = (authorization?: string) =>
  ({ headers: { authorization } } as unknown as Request)

const mockRes = {} as Response
const mockNext = vi.fn() as unknown as NextFunction

describe('auth middleware', () => {
  it('calls next() and attaches req.user when a valid Bearer token is provided', () => {
    const token = signToken({ id: 'user-1', email: 'user@example.com' })
    const req = makeReq(`Bearer ${token}`)

    auth(req, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalledOnce()
    expect(req.user).toMatchObject({ id: 'user-1', email: 'user@example.com' })
  })

  it('throws AppError 401 when Authorization header is missing', () => {
    const req = makeReq(undefined)
    expect(() => auth(req, mockRes, mockNext)).toThrow(AppError)
    expect(() => auth(req, mockRes, mockNext)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('throws AppError 401 when Authorization header does not start with Bearer', () => {
    const req = makeReq('Basic sometoken')
    expect(() => auth(req, mockRes, mockNext)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('throws AppError 401 when the token is invalid', () => {
    const req = makeReq('Bearer invalid.token.here')
    expect(() => auth(req, mockRes, mockNext)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    )
  })
})
