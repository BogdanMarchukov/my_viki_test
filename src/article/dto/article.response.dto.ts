import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@prisma/client';

export class ArticleResponse implements Article {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'email' })
  authorId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  content: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  version: number;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false, type: Date })
  deletedAt: Date | null;
}
