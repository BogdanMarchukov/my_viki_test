import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
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

  async findMany(ids?: string[]) {
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return users;
  }

  async selectForUpdate(id: string, prismaTransaction: PrismaService) {
    const record = await prismaTransaction.$queryRaw<User[]>`
          SELECT * FROM "users"
          WHERE id = ${id}::uuid and deleted_at is null
          FOR UPDATE
        `;
    if (!record.length) {
      throw new NotFoundException('user not found');
    }
    return record[0];
  }

  async delete(id: string, prismaTransaction = this.prismaService) {
    return prismaTransaction.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
