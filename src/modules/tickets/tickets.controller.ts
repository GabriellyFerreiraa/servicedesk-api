import type { Request, Response } from 'express';
import { TicketStatus } from '@prisma/client';
import { asyncHandler } from '../../lib/errors.js';
import * as service from './tickets.service.js';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await service.createTicket(req.user!, req.body);
  res.status(201).json(ticket);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  // Only accept a status filter if it's a real TicketStatus value.
  const raw = req.query.status;
  const status = typeof raw === 'string' && raw in TicketStatus ? (raw as TicketStatus) : undefined;

  const tickets = await service.listTickets(req.user!, { status });
  res.json(tickets);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await service.getTicket(req.user!, req.params.id);
  res.json(ticket);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await service.updateTicket(req.params.id, req.body);
  res.json(ticket);
});

export const comment = asyncHandler(async (req: Request, res: Response) => {
  const created = await service.addComment(req.user!, req.params.id, req.body.body);
  res.status(201).json(created);
});
