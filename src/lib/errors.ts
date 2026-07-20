import type { Request, Response, NextFunction, RequestHandler } from 'express';

// A predictable error we throw on purpose (e.g. 401, 404, 409).
// The error middleware turns it into a clean JSON response.
export class AppError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

// Wraps an async route handler so any thrown/rejected error is
// forwarded to the error middleware instead of crashing the request.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
