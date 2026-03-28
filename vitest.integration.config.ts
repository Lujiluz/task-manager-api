import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: { NODE_ENV: 'test' },
    include: ['tests/integration/**/*.test.ts'],
    setupFiles: ['tests/helpers/setup-integration.ts'],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    passWithNoTests: true,
  },
});
