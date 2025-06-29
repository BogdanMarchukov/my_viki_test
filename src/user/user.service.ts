import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserResponse } from './dto/user-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private prismaService: PrismaService,
  ) { }

  async findMany(
    ids?: string[] | string,
    tokenData?: unknown,
  ): Promise<UserResponse[]> {
    ids = ids ? (typeof ids === 'string' ? [ids] : ids) : undefined;
    await this.authRepository.findUserByTokenData(tokenData);
    return this.userRepository.findMany(ids);
  }

  async delete(id: string, tokenData: unknown) {
    await this.authRepository.findUserByTokenData(tokenData);
    await this.prismaService.$transaction(async (tx: PrismaService) => {
      const user = await this.userRepository.selectForUpdate(id, tx);
      await this.userRepository.delete(user.id, tx);
    });
    return { message: 'user deleted' };
  }
}
