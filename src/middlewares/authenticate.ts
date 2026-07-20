import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

// Verifies the Bearer token and attaches the current user (with roles
// read FRESH from the database) to req.user. Roles never come from the
// client or the token — the database is the single source of truth.
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError(401, 'Missing or invalid Authorization header');
    }

    const token = header.slice('Bearer '.length);
    const payload = verifyToken(token); // throws if invalid or expired

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        roles: { select: { role: true } },
      },
    });

    if (!user) throw new AppError(401, 'User no longer exists');

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.map((r) => r.role),
    };

    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError(401, 'Invalid or expired token'));
  }
}
