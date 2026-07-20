import { Prisma, Role, TicketStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/errors.js';
import type { CreateTicketInput, UpdateTicketInput } from './tickets.schemas.js';

// Minimal view of the person performing the action.
type Actor = { id: string; roles: Role[] };

// Agents and admins are "staff": they can see and act on every ticket.
function isStaff(roles: Role[]): boolean {
  return roles.includes(Role.AGENT) || roles.includes(Role.ADMIN);
}

// Reused shape so requester/assignee always come back as safe public data.
const publicUserSelect = { select: { id: true, name: true, email: true } };

export async function createTicket(actor: Actor, input: CreateTicketInput) {
  return prisma.ticket.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority, // undefined -> Prisma uses the default (MEDIUM)
      category: input.category,
      requesterId: actor.id,
    },
  });
}

export async function listTickets(actor: Actor, filters: { status?: TicketStatus }) {
  const where: Prisma.TicketWhereInput = {};
  if (filters.status) where.status = filters.status;

  // Requesters only ever see their own tickets. This is enforced here,
  // in the query, not on the client.
  if (!isStaff(actor.roles)) where.requesterId = actor.id;

  return prisma.ticket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { requester: publicUserSelect, assignee: publicUserSelect },
  });
}

async function findTicketOr404(id: string, withComments = false) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      requester: publicUserSelect,
      assignee: publicUserSelect,
      comments: withComments
        ? { orderBy: { createdAt: 'asc' }, include: { author: { select: { id: true, name: true } } } }
        : false,
    },
  });
  if (!ticket) throw new AppError(404, 'Ticket not found');
  return ticket;
}

export async function getTicket(actor: Actor, id: string) {
  const ticket = await findTicketOr404(id, true);
  if (!isStaff(actor.roles) && ticket.requesterId !== actor.id) {
    throw new AppError(403, 'You can only view your own tickets');
  }
  return ticket;
}

// Only staff reach this (guarded at the route with requireRole).
export async function updateTicket(id: string, input: UpdateTicketInput) {
  await findTicketOr404(id); // 404 if it doesn't exist

  if (input.assigneeId) {
    const assignee = await prisma.user.findUnique({ where: { id: input.assigneeId } });
    if (!assignee) throw new AppError(400, 'Assignee user does not exist');
  }

  return prisma.ticket.update({
    where: { id },
    data: {
      status: input.status,
      priority: input.priority,
      assigneeId: input.assigneeId,
    },
    include: { requester: publicUserSelect, assignee: publicUserSelect },
  });
}

export async function addComment(actor: Actor, ticketId: string, body: string) {
  const ticket = await findTicketOr404(ticketId);
  if (!isStaff(actor.roles) && ticket.requesterId !== actor.id) {
    throw new AppError(403, 'You can only comment on your own tickets');
  }
  return prisma.comment.create({
    data: { body, ticketId, authorId: actor.id },
    include: { author: { select: { id: true, name: true } } },
  });
}
