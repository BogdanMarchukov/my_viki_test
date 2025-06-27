import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SecretService } from './services/secret.service';

@Injectable()
export class AuthRepository {
  constructor(
    private prismaService: PrismaService,
    private secretService: SecretService,
  ) {}

  async saveUserPassword(
    userId: string,
    password: string,
    prismaTransaction = this.prismaService,
  ) {
    const salt = this.secretService.generateSalt();
    const hash = await this.secretService.passwordToHash(password, salt);
    return this.setUserAuth(userId, salt, hash, prismaTransaction);
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
