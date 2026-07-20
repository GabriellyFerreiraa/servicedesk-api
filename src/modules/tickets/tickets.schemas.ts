import { z } from 'zod';
import { TicketStatus, TicketPriority } from '@prisma/client';

export const createTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  priority: z.nativeEnum(TicketPriority).optional(),
  category: z.string().min(1).optional(),
});

export const updateTicketSchema = z
  .object({
    status: z.nativeEnum(TicketStatus).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    assigneeId: z.string().uuid('assigneeId must be a valid id').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

export const createCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty'),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
