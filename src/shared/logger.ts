import pino from 'pino';
import pinoHttp from 'pino-http';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino(
  isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
        level: 'debug',
      }
    : {
        level: 'info',
      }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const httpLogger = pinoHttp({ logger: logger as any });
