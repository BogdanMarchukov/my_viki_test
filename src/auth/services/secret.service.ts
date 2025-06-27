import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pbkdf2, randomBytes } from 'crypto';
import { RootConfigKeys, UserPassword } from 'src/common/config/type';
import { promisify } from 'util';

@Injectable()
export class SecretService {
  constructor(private configService: ConfigService) {}
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
}
