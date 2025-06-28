import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RootConfigKeys } from 'src/common/config/type';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './services/auth.service';
import { SecretService } from './services/secret.service';
import { JwtStrategy } from './strateges/jwt.stratedy';

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
  providers: [AuthService, AuthRepository, SecretService, JwtStrategy],
  exports: [AuthRepository],
})
export class AuthModule { }
