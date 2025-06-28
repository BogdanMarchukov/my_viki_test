import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsBoolean()
  isPublish: boolean;
}
