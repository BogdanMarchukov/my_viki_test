import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './services/auth.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthDto } from './dto/auth.dto';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, RootConfigKeys } from 'src/common/config/type';
import { SignInResponse } from './dto/sigin-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Post('signup')
  @ApiCreatedResponse({
    description: 'Registration new user',
    type: UserResponse,
  })
  async userSignUp(@Body() inputData: AuthDto): Promise<User> {
    return this.authService.userSignUp(inputData);
  }

  @Post('signin')
  async userSignIn(
    @Body() inputData: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignInResponse> {
    const { accessToken, refreshToken, userId } =
      await this.authService.userSignIn(inputData);
    const config = this.configService.get<AuthConfig>(
      RootConfigKeys.AUTH_CONFIG,
    )!;
    response.cookie('refreshToken', refreshToken, {
      maxAge: config.refresh.maxAge,
      httpOnly: true,
    });
    return { accessToken, userId };
  }
}
