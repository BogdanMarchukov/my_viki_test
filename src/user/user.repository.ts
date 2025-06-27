import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  createUser(
    data: Prisma.UserUncheckedCreateInput,
    prismaTransaction = this.prismaService,
  ) {
    return prismaTransaction.user.create({ data });
  }
}
