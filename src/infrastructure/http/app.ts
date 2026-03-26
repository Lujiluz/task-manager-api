import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import router from '../../presentation/routes';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors()); // TODO: restrict origins before adding authentication
  app.use(express.json());

  app.use('/api', router);

  return app;
};
