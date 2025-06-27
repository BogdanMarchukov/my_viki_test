import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse {
  @ApiProperty({ format: 'jwt' })
  accessToken: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;
}
