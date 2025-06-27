import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/auth.dto';
import { UserResponse } from 'src/user/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signin')
  @ApiCreatedResponse({
    description: 'Login new user',
    type: UserResponse,
  })
  async userSignIn(@Body() inputData: CreateUserDto): Promise<User> {
    return this.authService.userSignIn(inputData);
  }
}
