import { config } from '../../config/index.js';
import { logger } from '../../shared/logger.js';
import { connectWithRetry, prisma } from '../database/prisma.js';
import { createApp } from './app.js';

export const startServer = async (): Promise<void> => {
  await connectWithRetry();
  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}`);
  });

  // graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received - shutting down gracefully...`)

    server.close(async () => {
      logger.info('HTTP server closed')
      await prisma.$disconnect()
      logger.info('database disconnected')
      process.exit(0)
    })

    // handler if shutdown takes too long
    setTimeout(() => {
      logger.error('Shutdown takes too long, force shutdown.')
      process.exit(1)
    }, 10_000).unref()
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
};
