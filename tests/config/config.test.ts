import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('config', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('exports PORT as a number, defaulting to 3000', async () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.JWT_SECRET = 'test-secret';
    delete process.env.PORT;
    const { config } = await import('../../src/config');
    expect(config.port).toBe(3000);
    expect(typeof config.port).toBe('number');
  });

  it('uses the PORT env var when set', async () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.PORT = '4000';
    const { config } = await import('../../src/config');
    expect(config.port).toBe(4000);
  });

  it('defaults NODE_ENV to development', async () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.JWT_SECRET = 'test-secret';
    delete process.env.NODE_ENV;
    const { config } = await import('../../src/config');
    expect(config.nodeEnv).toBe('development');
  });

  it('accepts valid NODE_ENV values', async () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'production';
    const { config } = await import('../../src/config');
    expect(config.nodeEnv).toBe('production');
  });

  it('accepts NODE_ENV: test', async () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'test';
    const { config } = await import('../../src/config');
    expect(config.nodeEnv).toBe('test');
  });

  it('throws on invalid NODE_ENV value', async () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'prod';
    await expect(import('../../src/config')).rejects.toThrow('Invalid environment variables');
  });

  it('throws when DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL;
    await expect(import('../../src/config')).rejects.toThrow('Invalid environment variables');
  });

  it('exports DATABASE_URL as a string', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@host/db';
    process.env.JWT_SECRET = 'test-secret';
    const { config } = await import('../../src/config');
    expect(config.databaseUrl).toBe('postgresql://user:pass@host/db');
  });
});
