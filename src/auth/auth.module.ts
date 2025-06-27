import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './services/auth.service';
import { SecretService } from './services/secret.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RootConfigKeys } from 'src/common/config/type';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>(RootConfigKeys.JWT_SECRET)!;
        return {
          secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, SecretService],
})
export class AuthModule { }
