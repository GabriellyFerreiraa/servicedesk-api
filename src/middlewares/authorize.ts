import type { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../lib/errors.js';

// Guards a route so only users holding one of the allowed roles can pass.
// Must be used AFTER `authenticate`, which populates req.user.roles.
export function requireRole(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, 'Not authenticated'));

    const hasPermittedRole = req.user.roles.some((r) => allowed.includes(r));
    if (!hasPermittedRole) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}
