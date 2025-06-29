import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SecretService } from './services/secret.service';

@Injectable()
export class AuthRepository {
  constructor(
    private prismaService: PrismaService,
    private secretService: SecretService,
  ) { }

  async saveUserPassword(
    userId: string,
    password: string,
    prismaTransaction = this.prismaService,
  ) {
    const salt = this.secretService.generateSalt();
    const hash = await this.secretService.passwordToHash(password, salt);
    return this.setUserAuth(userId, salt, hash, prismaTransaction);
  }

  async findUserAndAuthByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        UserAuth: true,
      },
    });
    return user;
  }

  async findUserByTokenData(tokenData: unknown) {
    if (
      !tokenData ||
      typeof tokenData !== 'object' ||
      !('userId' in tokenData) ||
      !('tokenType' in tokenData) ||
      tokenData.tokenType !== 'access'
    ) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: tokenData.userId as string,
      },
      include: {
        UserAuth: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private async setUserAuth(
    userId: string,
    publicKey: string,
    secretKey: string,
    prismaTransaction = this.prismaService,
  ) {
    const data: Prisma.UserAuthUncheckedCreateInput = {
      userId,
      publicKey: publicKey,
      secretKey: secretKey,
    };

    const where: Prisma.UserAuthWhereUniqueInput = {
      id: userId,
    };
    const result = await prismaTransaction.userAuth.upsert({
      create: data,
      where,
      update: data,
    });
    return result;
  }
}
