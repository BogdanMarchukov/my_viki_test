import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  @Post('/signin')
  async userSignIn(@Body() inputData: CreateUserDto) { }
}
