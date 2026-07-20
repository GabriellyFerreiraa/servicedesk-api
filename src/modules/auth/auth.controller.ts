import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/errors.js';
import { registerUser, loginUser } from './auth.service.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json(result);
});
