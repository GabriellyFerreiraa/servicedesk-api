import { Router } from 'express';
import { validateBody } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { registerSchema, loginSchema } from './auth.schemas.js';
import { register, login } from './auth.controller.js';

export const authRouter = Router();

// Public routes
authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);

// Protected route: returns the logged-in user. Handy for testing that a
// token works, and it confirms roles are read from the database.
authRouter.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});
