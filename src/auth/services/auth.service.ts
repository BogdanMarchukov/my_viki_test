import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/user/user.repository';
import { AuthRepository } from '../auth.repository';
import { CreateUserDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    private prismaService: PrismaService,
  ) { }

  async userSignIn(data: CreateUserDto): Promise<User> {
    const user = await this.prismaService.$transaction(
      async (tx: PrismaService) => {
        const createUserData: Prisma.UserUncheckedCreateInput = {
          email: data.email,
        };
        const user = await this.userRepository.createUser(createUserData, tx);
        await this.authRepository.saveUserPassword(user.id, data.password, tx);
        return user;
      },
    );
    return user;
  }
}
