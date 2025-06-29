/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/services/auth.service';
import { startTestDb, stopTestDb } from 'test/setup-tests';

let app: INestApplication;
let prisma: PrismaService;
let jwt: string;
let createdUserId: string;
let secondUserId: string;

beforeAll(async () => {
  await startTestDb();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  prisma = app.get(PrismaService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();

  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
    },
  });

  const secondUser = await prisma.user.create({
    data: {
      email: 'user2@test.com',
    },
  });

  createdUserId = user.id;
  secondUserId = secondUser.id;

  jwt = 'Bearer ' + app.get(AuthService).generateAccessToken_OnlyTest(user.id);
}, 30000);

afterAll(async () => {
  await app.close();
  await stopTestDb();
});

describe('UserController (e2e)', () => {
  it('GET /users — get all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', jwt)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(res.body.find((u: any) => u.id === createdUserId)).toBeDefined();
  });

  it('GET /users?id=:id — filter users by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users?id=${createdUserId}`)
      .set('Authorization', jwt)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(createdUserId);
  });

  it('DELETE /users/:id — soft delete user', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/users/${secondUserId}`)
      .set('Authorization', jwt)
      .expect(200);
  });

  it('GET /users?id=:id — returns one user after deletion', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users?id=${secondUserId}&id=${createdUserId}`)
      .set('Authorization', jwt)
      .expect(200);

    expect(res.body.length).toBe(1);
  });
});
