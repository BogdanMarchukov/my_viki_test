import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/crete-article.dto';
import { TokenPayload } from 'src/auth/types';
import { AuthRepository } from 'src/auth/auth.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleRepository } from '../article.repository';
import { Prisma } from '@prisma/client';
import { ArticleResponse } from '../dto/article.response.dto';

@Injectable()
export class ArticleService {
  constructor(
    private authRepository: AuthRepository,
    private prismaService: PrismaService,
    private articleRepository: ArticleRepository,
  ) { }

  async createArticle(
    data: CreateArticleDto,
    authTokenData: unknown,
  ): Promise<ArticleResponse> {
    const author = await this.authRepository.findUserByTokenData(authTokenData);
    const article = await this.prismaService.$transaction(
      async (tx: PrismaService) => {
        const createArticleData: Prisma.ArticleUncheckedCreateInput = {
          title: data.title,
          content: data.content,
          tags: data.tags,
          authorId: author.id,
          version: 0,
          updatedBy: author.id,
        };
        const article = await this.articleRepository.create(
          createArticleData,
          tx,
        );
        return article;
      },
    );
    return article;
  }
}
