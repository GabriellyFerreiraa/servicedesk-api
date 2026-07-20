import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../lib/errors.js';

// Runs a Zod schema against the request body. On failure it returns a
// 400 with a readable message; on success it replaces req.body with the
// parsed (and typed) data.
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      return next(new AppError(400, message));
    }
    req.body = result.data;
    next();
  };
}
