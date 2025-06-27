import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2, randomBytes } from 'crypto';
import {
  AuthConfig,
  RootConfigKeys,
  UserPassword,
} from 'src/common/config/type';
import { promisify } from 'util';

@Injectable()
export class SecretService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }
  private static pbkdf2 = promisify(pbkdf2);

  async passwordToHash(password: string, salt: string): Promise<string> {
    const configs = this.configService.get<UserPassword>(
      RootConfigKeys.USER_PASSWORD,
    )!;
    const hash = await SecretService.pbkdf2(
      password,
      salt,
      configs.iterations,
      configs.hashLength,
      configs.digest,
    );
    return hash.toString('hex');
  }

  generateSalt(length = 0): string {
    const configs = this.configService.get<UserPassword>(
      RootConfigKeys.USER_PASSWORD,
    )!;
    return randomBytes(length || configs.saltLength).toString('base64');
  }

  async passwordCheck(
    password: string,
    salt: string,
    hash: string,
  ): Promise<boolean> {
    const hashFormPassword = await this.passwordToHash(password, salt);
    return hashFormPassword === hash;
  }

  generateJwt(userId: string, tokenType: 'access' | 'refresh') {
    const { access, refresh } = this.configService.get<AuthConfig>(
      RootConfigKeys.AUTH_CONFIG,
    )!;
    const expiresIn =
      tokenType === 'access' ? access.expiresIn : refresh.expiresIn;
    const payload = {
      userId,
      tokenType,
    };
    return this.jwtService.sign(payload, { expiresIn });
  }
}
