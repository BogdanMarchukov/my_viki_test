import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  userSignIn(data: CreateUserDto) { }
}
