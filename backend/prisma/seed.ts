import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const passwordHash = await bcrypt.hash('AdminnPass123!', 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  await prisma.todo.updateMany({
    data: { userId: admin.id },
  });
}

main().finally(() => prisma.$disconnect());
