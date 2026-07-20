import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// What we store inside the token. Only identity — never roles or secrets.
// Roles are always read fresh from the database when needed.
export interface TokenPayload {
  sub: string;   // the user's id
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
