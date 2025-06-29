import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { startTestDb, stopTestDb } from 'test/setup-tests';

let app: INestApplication;
let prisma: PrismaService;

const testUser = {
  email: 'authuser@test.com',
  password: 'testpass123',
};

beforeAll(async () => {
  await startTestDb();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  prisma = app.get(PrismaService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();
}, 30000);

afterAll(async () => {
  await app.close();
  await stopTestDb();
});

describe('AuthController (e2e)', () => {
  it('POST /auth/signup — should register user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.email).toBe(testUser.email);

    // confirm user is in db
    const dbUser = await prisma.user.findUnique({
      where: { email: testUser.email },
    });
    expect(dbUser).not.toBeNull();
  });

  it('POST /auth/signin — should return access token and set refresh token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('userId');

    const cookies = res.headers['set-cookie'] as unknown as string[];

    expect(cookies.some((cookie) => cookie.includes('refreshToken'))).toBe(
      true,
    );
  });

  it('POST /auth/signin — should fail with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ ...testUser, password: 'wrongpassword' })
      .expect(401);
  });
});
