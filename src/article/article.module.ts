import { Module } from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { ArticleVersionService } from './services/article-version.service';
import { ArticleController } from './article.controller';

@Module({
  providers: [ArticleService, ArticleVersionService],
  controllers: [ArticleController]
})
export class ArticleModule {}
