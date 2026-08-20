import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const loadEnvFile = (process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }).loadEnvFile;
loadEnvFile?.('.env');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@otiko.local';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
  await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', status: 'ACTIVE' },
    create: { name: 'Otiko Administrator', email, phone: '+254700000000', password: await argon2.hash(password), role: 'ADMIN' },
  });
  console.log(`Admin account ready: ${email}`);
}

main().finally(() => prisma.$disconnect());
