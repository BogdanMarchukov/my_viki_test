import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { ArticleVersionService } from './services/article-version.service';
import { ArticleService } from './services/article.service';

@Module({
  imports: [AuthModule],
  providers: [ArticleService, ArticleVersionService, ArticleRepository],
  controllers: [ArticleController],
})
export class ArticleModule { }
