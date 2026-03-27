import { config } from '../../config';
import { logger } from '../../shared/logger';
import { createApp } from './app';

export const startServer = (): void => {
  const app = createApp();

  app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}`);
  });
};
