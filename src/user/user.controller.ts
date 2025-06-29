import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ArticleDeleteResponseDto as DeleteResponseDto } from 'src/article/dto/article-delete.response.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { UserResponse } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'id',
    required: false,
    type: 'string',
    format: 'uuid',
    isArray: true,
    description: 'Filter by ids(s)',
  })
  @ApiCreatedResponse({
    description: 'Get list of users',
    type: UserResponse,
  })
  @Get()
  getAll(@Req() req: Request, @Query('id') ids?: string[] | string) {
    return this.userService.findMany(ids, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({
    description: 'delete one user',
    type: DeleteResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'ID of the user',
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<DeleteResponseDto> {
    return this.userService.delete(id, req.user);
  }
}
