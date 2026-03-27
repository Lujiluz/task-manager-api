import { describe, it, expect, vi } from 'vitest'

vi.mock('../../../src/config', () => ({
  config: {
    nodeEnv: 'test',
    port: 3000,
    databaseUrl: 'postgresql://test',
    jwtSecret: 'test-jwt-secret',
  },
}))

import { signToken, verifyToken, type JwtPayload } from '../../../src/shared/utils/jwt'

const payload: JwtPayload = { id: 'user-123', email: 'test@example.com' }

describe('jwt utils', () => {
  it('signToken() returns a non-empty string', () => {
    const token = signToken(payload)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('verifyToken() returns the original payload', () => {
    const token = signToken(payload)
    const decoded = verifyToken(token)
    expect(decoded.id).toBe(payload.id)
    expect(decoded.email).toBe(payload.email)
  })

  it('verifyToken() throws for an invalid token', () => {
    expect(() => verifyToken('not.a.valid.token')).toThrow()
  })

  it('verifyToken() throws for a tampered token', () => {
    const token = signToken(payload)
    const tampered = token.slice(0, -4) + 'xxxx'
    expect(() => verifyToken(tampered)).toThrow()
  })
})
