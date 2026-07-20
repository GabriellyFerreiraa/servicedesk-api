# 🎫 Service Desk API

A REST API for a Service Desk / ticketing system, built from scratch with **Node.js, Express and TypeScript**, using **PostgreSQL + Prisma**. Role-based access control (Admin / Agent / Requester), JWT authentication, and input validation with Zod.

> Built by hand as a portfolio project by someone who works in Service Desk / QA — the domain modeling reflects real support-team workflows.

![CI](https://github.com/GabriellyFerreiraa/servicedesk-api/actions/workflows/ci.yml/badge.svg)

---

## 🇬🇧 English

### Tech stack
- **Runtime:** Node.js + Express
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT + bcrypt password hashing
- **Validation:** Zod
- **Tests:** Vitest + Supertest
- **CI:** GitHub Actions

### Security by design
Roles are stored in a dedicated `UserRole` table — never as a column on the user profile. Users can edit their own profile but can never grant themselves a role; role assignment only happens through admin-guarded endpoints. This removes the privilege-escalation path that a "role on profile" design creates.

### Getting started
```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npm run prisma:migrate      # create the database schema
npm run dev                 # start on http://localhost:3000
```

### Roles
| Role | Can do |
|------|--------|
| Requester | Create and view their own tickets, comment on them |
| Agent | View/assign/resolve any ticket, comment |
| Admin | Everything, plus manage users and role assignments |

---

## 🇪🇸 Español

API REST para un sistema de Service Desk / tickets, hecha desde cero con **Node.js, Express y TypeScript**, usando **PostgreSQL + Prisma**. Control de acceso por roles (Admin / Agente / Solicitante), autenticación con JWT y validación con Zod.

### Seguridad por diseño
Los roles se guardan en una tabla `UserRole` separada, nunca como columna del perfil. Un usuario puede editar su propio perfil pero jamás asignarse un rol: los roles solo se cambian mediante endpoints protegidos para administradores. Esto elimina el riesgo de escalada de privilegios.

### Cómo empezar
```bash
npm install
cp .env.example .env        # completar DATABASE_URL y JWT_SECRET
npm run prisma:migrate
npm run dev
```

---

## 🇧🇷 Português

API REST para um sistema de Service Desk / tickets, feita do zero com **Node.js, Express e TypeScript**, usando **PostgreSQL + Prisma**. Controle de acesso por papéis (Admin / Agente / Solicitante), autenticação com JWT e validação com Zod.

### Segurança por design
Os papéis ficam em uma tabela `UserRole` separada, nunca como coluna no perfil. O usuário pode editar o próprio perfil, mas nunca se atribuir um papel: papéis só mudam por endpoints protegidos para administradores. Isso elimina o risco de escalonamento de privilégios.

### Como começar
```bash
npm install
cp .env.example .env        # preencher DATABASE_URL e JWT_SECRET
npm run prisma:migrate
npm run dev
```
