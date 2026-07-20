import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Promote an existing user to a role.
// Usage:  npm run seed -- <email> <ROLE>
//   ROLE = ADMIN | AGENT | REQUESTER
async function main() {
  const [email, roleArg] = process.argv.slice(2);

  if (!email || !roleArg) {
    console.error('Usage: npm run seed -- <email> <ROLE>   (ROLE = ADMIN | AGENT | REQUESTER)');
    process.exit(1);
  }

  const role = roleArg.toUpperCase() as Role;
  if (!(role in Role)) {
    console.error(`Invalid role "${roleArg}". Use ADMIN, AGENT or REQUESTER.`);
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email "${email}". Register that user first, then run the seed.`);
    process.exit(1);
  }

  // Upsert so running it twice is safe (no duplicate rows).
  await prisma.userRole.upsert({
    where: { userId_role: { userId: user.id, role } },
    create: { userId: user.id, role },
    update: {},
  });

  console.log(`Done: ${email} now has role ${role}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
