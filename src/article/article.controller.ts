import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional.guard';
import { OptionalParseBoolPipe } from 'src/common/validate/optional-boole.pipe';
import { ArticleResponse } from './dto/article.response.dto';
import { CreateArticleDto } from './dto/crete-article.dto';
import { ArticleService } from './services/article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({
    description: 'Create new article',
    type: ArticleResponse,
  })
  async create(@Body() dto: CreateArticleDto, @Req() req: Request) {
    return this.articleService.createArticle(dto, req.user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'tag',
    required: false,
    type: String,
    isArray: true,
    description: 'Filter by tag(s)',
  })
  @ApiQuery({
    name: 'isPublish',
    required: false,
    type: Boolean,
    description: 'Filter by publish state',
  })
  @ApiCreatedResponse({
    description: 'Get list of articles (auth optional)',
    type: ArticleResponse,
  })
  @Get()
  getAll(
    @Req() req: Request,
    @Query('tag') tags?: string[] | string,
    @Query('isPublish', OptionalParseBoolPipe)
    isPublish?: boolean,
  ) {
    return this.articleService.findMany({ tags, isPublish }, req.user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({
    description: 'Get list of articles (auth optional)',
    type: ArticleResponse,
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'ID of the article',
  })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<ArticleResponse> {
    return this.articleService.findById(id);
  }
  //
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async create(@Body() dto: CreateArticleDto) {
  //   return this.articleService.create(dto);
  // }
  //
  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UpdateArticleDto,
  // ) {
  //   return this.articleService.update(id, dto);
  // }
  //
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // async delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.articleService.delete(id);
  // }
}
