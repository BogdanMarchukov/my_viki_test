import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserResponse implements User {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  deletedAt: Date;
}
