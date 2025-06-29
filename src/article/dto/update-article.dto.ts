import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPublish?: boolean;

  @ApiProperty()
  @IsNumber()
  version: number;
}
