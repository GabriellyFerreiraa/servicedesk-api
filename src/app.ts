import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes.js';
import { ticketsRouter } from './modules/tickets/tickets.routes.js';
import { errorHandler } from './middlewares/error.js';

// The Express app is built here (without starting the server) so that
// tests can import it and hit the routes directly.
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'servicedesk-api' });
  });

  // Feature routes
  app.use('/auth', authRouter);
  app.use('/tickets', ticketsRouter);

  // Error handler must be registered LAST, after all routes.
  app.use(errorHandler);

  return app;
}
