import type { Role } from '@prisma/client';

// Teaches TypeScript that Express requests may carry an authenticated
// user (added by the `authenticate` middleware).
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        roles: Role[];
      };
    }
  }
}

export {};
