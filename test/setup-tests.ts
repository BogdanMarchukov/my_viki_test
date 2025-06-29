import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as waitPort from 'wait-port';

let container: StartedTestContainer;
let prisma: PrismaClient;

export async function startTestDb() {
  container = await new GenericContainer('postgres')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: 'test',
      POSTGRES_PASSWORD: 'test',
      POSTGRES_DB: 'testdb',
    })
    .start();

  const port = container.getMappedPort(5432);
  const host = container.getHost();
  const dbUrl = `postgresql://test:test@${host}:${port}/testdb?schema=public`;
  process.env.DATABASE_URL = dbUrl;

  await waitPort({ host, port, timeout: 10000, output: 'silent' });

  execSync(`npx prisma migrate deploy`, {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl },
  });

  prisma = new PrismaClient();
  await prisma.$connect();

  return { dbUrl, prisma };
}

export async function stopTestDb() {
  try {
    await prisma?.$disconnect();
    await new Promise((res) => setTimeout(res, 100));
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.warn('Failed to disconnect Prisma cleanly:', err.message);
  }
  try {
    await container?.stop();
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.warn('Container stop error:', err.message);
  }
}
