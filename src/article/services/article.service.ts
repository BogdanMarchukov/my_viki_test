import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from '../dto/crete-article.dto';
import { TokenPayload } from 'src/auth/types';
import { AuthRepository } from 'src/auth/auth.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleRepository } from '../article.repository';
import { Article, Prisma } from '@prisma/client';
import { ArticleResponse } from '../dto/article.response.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

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

  async findMany(
    filter: { tags?: string[] | string; isPublish?: boolean },
    tokenData?: unknown,
  ) {
    const isPublish = await this.isPublishMake(tokenData, filter.isPublish);
    let tags = filter.tags;
    if (typeof tags === 'string') {
      tags = [tags];
    }
    const where: Prisma.ArticleWhereInput = {
      isPublished: isPublish,
    };
    if (tags) {
      where.tags = { hasSome: tags };
    }
    const articles = await this.articleRepository.findMany(where);
    return articles;
  }

  async findById(id: string, tokenData?: TokenPayload) {
    const isPublished = await this.isPublishMake(tokenData, true);

    const result = await this.articleRepository.findById({
      id,
      isPublished,
    });

    if (!result) {
      throw new NotFoundException('Article not found');
    }
    return result;
  }

  async update(id: string, data: UpdateArticleDto, tokenData?: unknown) {
    const author = await this.authRepository.findUserByTokenData(tokenData);
    const article = await this.prismaService.$transaction(
      async (tx: PrismaService) => {
        const currentArticle = await this.articleRepository.selectForUpdate(
          id,
          tx,
        );
        const isLastVersion = this.isLastVersion(currentArticle, data.version);
        if (isLastVersion) {
          const updateArticleData: Prisma.ArticleUncheckedUpdateInput = {
            title: data.title,
            content: data.content,
            tags: data.tags,
            updatedBy: author.id,
            version: currentArticle.version + 1,
          };
          const article = await this.articleRepository.update(
            id,
            updateArticleData,
            tx,
          );
          return article;
        } else {
          throw new ConflictException(
            `Article is not last version: last version is ${currentArticle.version}`,
          );
        }
      },
    );

    return article;
  }

  private isLastVersion(currentArticle: Article, inputVersion: number) {
    const result = currentArticle.version === inputVersion;
    if (!result && inputVersion > currentArticle.version) {
      throw new ConflictException(
        `Invalid version, current version is ${currentArticle.version}`,
      );
    }
    return result;
  }

  private async isPublishMake(
    tokenData: unknown,
    isPublish?: boolean,
  ): Promise<boolean | undefined> {
    try {
      await this.authRepository.findUserByTokenData(tokenData);
      return isPublish;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false;
    }
  }
}
