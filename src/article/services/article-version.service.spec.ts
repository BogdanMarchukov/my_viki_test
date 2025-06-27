import { Test, TestingModule } from '@nestjs/testing';
import { ArticleVersionService } from './article-version.service';

describe('ArticleVersionService', () => {
  let service: ArticleVersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleVersionService],
    }).compile();

    service = module.get<ArticleVersionService>(ArticleVersionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
