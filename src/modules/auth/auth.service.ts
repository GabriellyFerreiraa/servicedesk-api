import { Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { hashPassword, comparePassword } from '../../lib/password.js';
import { signToken } from '../../lib/jwt.js';
import { AppError } from '../../lib/errors.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

// Shape returned to the client. Note: passwordHash is NEVER included.
function publicUser(user: { id: string; name: string; email: string; roles: { role: Role }[] }) {
  return { id: user.id, name: user.name, email: user.email, roles: user.roles.map((r) => r.role) };
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError(409, 'An account with this email already exists');

  const passwordHash = await hashPassword(input.password);

  // Create the user and give them the default REQUESTER role in one step.
  // Roles live in their own table — a user can never grant themselves one.
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      roles: { create: [{ role: Role.REQUESTER }] },
    },
    select: { id: true, name: true, email: true, roles: { select: { role: true } } },
  });

  const token = signToken({ sub: user.id, email: user.email });
  return { token, user: publicUser(user) };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true, name: true, email: true, passwordHash: true, roles: { select: { role: true } } },
  });

  // Use the SAME error for "no such email" and "wrong password" so we
  // don't reveal which emails have accounts.
  if (!user) throw new AppError(401, 'Invalid email or password');

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw new AppError(401, 'Invalid email or password');

  const token = signToken({ sub: user.id, email: user.email });
  return { token, user: publicUser(user) };
}
