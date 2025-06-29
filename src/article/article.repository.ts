import { Article, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ArticleRepository {
  constructor(private prismaService: PrismaService) { }

  async create(
    data: Prisma.ArticleUncheckedCreateInput,
    prismaTransaction = this.prismaService,
  ) {
    data = { ...data, version: 1 };

    const article = await prismaTransaction.article.create({ data });
    await this.createNewVersion(article, prismaTransaction);
    return article;
  }

  async findMany(
    where: Prisma.ArticleWhereInput,
    prismaTransaction = this.prismaService,
  ) {
    return prismaTransaction.article.findMany({ where });
  }

  async findById(
    where: Prisma.ArticleWhereUniqueInput,
    prismaTransaction = this.prismaService,
  ) {
    return prismaTransaction.article.findFirst({ where });
  }

  async selectForUpdate(id: string, prismaTransaction: PrismaService) {
    const record = await prismaTransaction.$queryRaw<Article[]>`
          SELECT * FROM "articles"
          WHERE id = ${id}::uuid
          FOR UPDATE
        `;
    if (!record.length) {
      throw new NotFoundException('article not found');
    }
    return record[0];
  }

  async update(
    id: string,
    data: Prisma.ArticleUncheckedUpdateInput,
    prismaTransaction = this.prismaService,
  ) {
    const article = await prismaTransaction.article.update({
      where: { id },
      data,
    });
    await this.createNewVersion(article, prismaTransaction);
    return article;
  }

  private createNewVersion(
    article: Article,
    prismaTransaction = this.prismaService,
  ) {
    const data: Prisma.ArticleVersionUncheckedCreateInput = {
      articleId: article.id,
      tags: article.tags,
      title: article.title,
      content: article.title,
      version: article.version,
      createdBy: article.authorId,
    };
    return prismaTransaction.articleVersion.create({ data });
  }
}
