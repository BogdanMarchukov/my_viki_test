/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/services/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { startTestDb, stopTestDb } from 'test/setup-tests';
import { AppModule } from '../../src/app.module';

let app: INestApplication;
let prisma: PrismaService;
let jwt: string;
let createdArticleId: string;

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
      email: 'test@test.com',
    },
  });

  jwt = 'Bearer ' + app.get(AuthService).generateAccessToken_OnlyTest(user.id);
}, 30000);

afterAll(async () => {
  await app.close();
  await stopTestDb();
});

describe('ArticleController (e2e)', () => {
  it('GET /articles — empty array initially', async () => {
    const res = await request(app.getHttpServer()).get('/articles').expect(200);

    expect(res.body).toEqual([]);
  });

  it('POST /articles — create article', async () => {
    const inputData = {
      title: 'Test Article',
      content: 'Some content here...',
      tags: ['nestjs', 'test'],
      isPublish: false,
    };
    const res = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', jwt)
      .send(inputData)
      .expect(201);

    expect(res.body).toHaveProperty('id');

    expect(res.body.title).toBe(inputData.title);
    expect(res.body.content).toBe(inputData.content);
    expect(res.body.tags).toEqual(inputData.tags);
    expect(res.body.isPublished).toBe(inputData.isPublish);

    createdArticleId = res.body.id;
    console.log(JSON.stringify(res.body));
  });

  it('GET /articles/:id — fetch created article', async () => {
    const res = await request(app.getHttpServer())
      .get(`/articles/${createdArticleId}`)
      .set('Authorization', jwt)
      .expect(200);

    expect(res.body.id).toBe(createdArticleId);
  });

  it('GET /articles/:id — unauthorized user trying to get non public article', async () => {
    await request(app.getHttpServer())
      .get(`/articles/${createdArticleId}`)
      .expect(404);
  });

  it('PATCH /articles/:id — update article', async () => {
    const updatedData = {
      title: 'Updated Title',
      content: 'Updated content',
      tags: ['nestjs', 'update'],
    };
    const res = await request(app.getHttpServer())
      .patch(`/articles/${createdArticleId}`)
      .set('Authorization', jwt)
      .send({
        ...updatedData,
        version: 1,
      })
      .expect(200);

    expect(res.body.title).toBe(updatedData.title);
    expect(res.body.content).toBe(updatedData.content);
    expect(res.body.tags).toEqual(updatedData.tags);
  });

  it('PATCH /articles/:id — we are updating from an outdated version', async () => {
    await request(app.getHttpServer())
      .patch(`/articles/${createdArticleId}`)
      .set('Authorization', jwt)
      .send({
        title: 'new',
        version: 1,
      })
      .expect(409);
  });

  it('DELETE /articles/:id — soft delete article', async () => {
    await request(app.getHttpServer())
      .delete(`/articles/${createdArticleId}`)
      .set('Authorization', jwt)
      .expect(200);
  });

  it('GET /articles/:id — returns 404 after delete', async () => {
    await request(app.getHttpServer())
      .get(`/articles/${createdArticleId}`)
      .set('Authorization', jwt)
      .expect(404);
  });
});
