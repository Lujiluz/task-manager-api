import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { httpLogger } from '../../shared/logger';
import { errorHandler } from '../../presentation/middlewares/errorHandler';
import router from '../../presentation/routes';

export const createApp = (): Application => {
  const app = express();

  app.use(httpLogger); // first — logs all incoming requests before any middleware can short-circuit
  app.use(helmet());
  app.use(cors()); // TODO: restrict origins before adding authentication
  app.use(express.json());

  app.use('/api', router);

  app.use(errorHandler); // last — catches all errors from routes

  return app;
};
