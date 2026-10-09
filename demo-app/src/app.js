import express from 'express';
import { routes } from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  app.use(rateLimiter);
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
