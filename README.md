# 🎫 Service Desk API

A REST API for a Service Desk / ticketing system, built from scratch with **Node.js, Express and TypeScript**, using **PostgreSQL + Prisma**. It features JWT authentication, role-based access control (Admin / Agent / Requester), request validation, integration tests and continuous integration.

![CI](https://github.com/GabriellyFerreiraa/servicedesk-api/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

> Built by hand by someone who works in Service Desk / QA — the domain modelling reflects real support-team workflows, and the test suite reflects a quality-first mindset.

---

## 🇬🇧 English

### Features
- **Authentication** — register / login with hashed passwords (bcrypt) and JWT.
- **Role-based access control** — `Admin`, `Agent`, `Requester`. Roles live in a **dedicated table**, never on the user profile, so a user can never grant themselves a role (no privilege escalation).
- **Tickets** — create, list, read, update and comment, with permissions enforced in the query layer.
- **Validation** — every request body is validated with Zod.
- **Tested** — integration tests (Vitest + Supertest), including a role-permission test.
- **CI** — GitHub Actions spins up an ephemeral PostgreSQL, runs migrations, type-checks, builds and tests on every push.

### Tech stack
Node.js · Express · TypeScript (strict) · PostgreSQL · Prisma · JWT · bcrypt · Zod · Vitest · Supertest · GitHub Actions

### Security by design
Authorization never trusts the client. The JWT carries only the user's identity; **roles are read fresh from the database on every request**. Passwords are stored only as bcrypt hashes, and login returns the same error for an unknown email and a wrong password, so registered emails are not revealed.

### API
| Method | Route | Access |
|--------|-------|--------|
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/me` | Authenticated |
| `POST` | `/tickets` | Any authenticated user |
| `GET` | `/tickets` | Requester: own tickets · Agent/Admin: all |
| `GET` | `/tickets/:id` | Ticket owner, Agent or Admin |
| `PATCH` | `/tickets/:id` | Agent or Admin |
| `POST` | `/tickets/:id/comments` | Ticket owner, Agent or Admin |

### Roles
| Role | Can do |
|------|--------|
| Requester | Create and view their own tickets, comment on them |
| Agent | View, assign and update any ticket, comment |
| Admin | Everything, plus manage users and role assignments |

### Getting started
```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env        # then set DATABASE_URL and JWT_SECRET

# 3. Create the database schema
npm run prisma:migrate

# 4. Run
npm run dev                 # http://localhost:3000
```

Promote a user to Agent or Admin (after they register):
```bash
npm run seed -- user@example.com ADMIN
```

### Testing
```bash
npm test
```
The suite registers a user, logs in, rejects a wrong password, and verifies that a Requester is **forbidden** from updating a ticket (403). Tests clean up the data they create.

### Project structure
```
src/
├── config/        # environment validation (Zod)
├── lib/           # prisma client, jwt, password hashing, errors
├── middlewares/   # authenticate, authorize (roles), validate, error handler
├── modules/
│   ├── auth/      # routes · controller · service · schemas
│   └── tickets/   # routes · controller · service · schemas
└── app.ts         # builds the Express app
prisma/
├── schema.prisma  # data model
└── seed.ts        # promote a user to a role
tests/             # integration tests
```

---

## 🇪🇸 Español

API REST para un sistema de Service Desk / tickets, hecha desde cero con **Node.js, Express y TypeScript**, usando **PostgreSQL + Prisma**.

### Características
- **Autenticación** con contraseñas hasheadas (bcrypt) y JWT.
- **Control de acceso por roles** (`Admin`, `Agente`, `Solicitante`). Los roles viven en una **tabla dedicada**, nunca en el perfil, evitando la escalada de privilegios.
- **Tickets**: crear, listar, ver, actualizar y comentar, con permisos aplicados en la capa de consulta.
- **Validación** de cada petición con Zod.
- **Tests** de integración (Vitest + Supertest) y **CI** con GitHub Actions.

### Seguridad por diseño
El JWT solo lleva la identidad del usuario; **los roles se leen de la base de datos en cada petición**. Las contraseñas se guardan solo como hash, y el login devuelve el mismo error para email inexistente y contraseña incorrecta.

### Cómo empezar
```bash
npm install
cp .env.example .env        # completar DATABASE_URL y JWT_SECRET
npm run prisma:migrate
npm run dev
```
Promover un usuario: `npm run seed -- user@example.com ADMIN`

Tests: `npm test`

---

## 🇧🇷 Português

API REST para um sistema de Service Desk / tickets, feita do zero com **Node.js, Express e TypeScript**, usando **PostgreSQL + Prisma**.

### Funcionalidades
- **Autenticação** com senhas em hash (bcrypt) e JWT.
- **Controle de acesso por papéis** (`Admin`, `Agente`, `Solicitante`). Os papéis ficam em uma **tabela dedicada**, nunca no perfil, evitando escalonamento de privilégios.
- **Tickets**: criar, listar, ver, atualizar e comentar, com permissões aplicadas na camada de consulta.
- **Validação** de cada requisição com Zod.
- **Testes** de integração (Vitest + Supertest) e **CI** com GitHub Actions.

### Segurança por design
O JWT carrega apenas a identidade; **os papéis são lidos do banco a cada requisição**. As senhas são guardadas apenas como hash, e o login retorna o mesmo erro para email inexistente e senha incorreta.

### Como começar
```bash
npm install
cp .env.example .env        # preencher DATABASE_URL e JWT_SECRET
npm run prisma:migrate
npm run dev
```
Promover um usuário: `npm run seed -- user@example.com ADMIN`

Testes: `npm test`

---

## License
MIT
