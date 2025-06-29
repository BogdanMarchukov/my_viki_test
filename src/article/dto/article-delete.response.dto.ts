import { ApiProperty } from '@nestjs/swagger';

export class ArticleDeleteResponseDto {
  @ApiProperty()
  message: string;
}
