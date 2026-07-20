import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../../middlewares/authenticate.js';
import { requireRole } from '../../middlewares/authorize.js';
import { validateBody } from '../../middlewares/validate.js';
import { createTicketSchema, updateTicketSchema, createCommentSchema } from './tickets.schemas.js';
import * as ctrl from './tickets.controller.js';

export const ticketsRouter = Router();

// Every ticket route requires a valid token.
ticketsRouter.use(authenticate);

// Any authenticated user can open a ticket and list/read their own.
ticketsRouter.post('/', validateBody(createTicketSchema), ctrl.create);
ticketsRouter.get('/', ctrl.list);
ticketsRouter.get('/:id', ctrl.getOne);
ticketsRouter.post('/:id/comments', validateBody(createCommentSchema), ctrl.comment);

// Only agents and admins can change a ticket (status, priority, assignment).
ticketsRouter.patch(
  '/:id',
  requireRole(Role.AGENT, Role.ADMIN),
  validateBody(updateTicketSchema),
  ctrl.update,
);
