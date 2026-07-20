import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

const app = createApp();

// A unique email per run so the tests never clash with existing data.
const email = `test_${Date.now()}@example.com`;
const password = 'password123';

const createdUserIds: string[] = [];
const createdTicketIds: string[] = [];

describe('Auth and role-based permissions', () => {
  it('registers a new user with the default REQUESTER role', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test User', email, password });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.roles).toEqual(['REQUESTER']);
    createdUserIds.push(res.body.user.id);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/auth/login').send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('rejects login with a wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('forbids a REQUESTER from updating a ticket (403)', async () => {
    const login = await request(app).post('/auth/login').send({ email, password });
    const token = login.body.token as string;

    const created = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test ticket', description: 'Something is broken' });

    expect(created.status).toBe(201);
    createdTicketIds.push(created.body.id);

    // A requester must NOT be able to change a ticket.
    const patched = await request(app)
      .patch(`/tickets/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'IN_PROGRESS' });

    expect(patched.status).toBe(403);
  });
});

// Remove everything these tests created, in dependency order.
afterAll(async () => {
  for (const ticketId of createdTicketIds) {
    await prisma.comment.deleteMany({ where: { ticketId } });
    await prisma.ticket.deleteMany({ where: { id: ticketId } });
  }
  for (const userId of createdUserIds) {
    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.ticket.deleteMany({ where: { requesterId: userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  await prisma.$disconnect();
});
