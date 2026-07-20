import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';

// Central error handler. Express recognises it as an error handler
// because it has four parameters. Registered LAST, after all routes.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err); // unexpected: log it, but don't leak details to the client
  return res.status(500).json({ error: 'Internal server error' });
}
