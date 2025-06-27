import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/user/user.repository';
import { AuthRepository } from '../auth.repository';
import { AuthDto } from '../dto/auth.dto';
import { SecretService } from './secret.service';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    private prismaService: PrismaService,
    private secretService: SecretService,
  ) { }

  async userSignUp(data: AuthDto): Promise<User> {
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

  async userSignIn(data: AuthDto) {
    const user = await this.authRepository.findUserAndAuthByEmail(data.email);
    const auth = user?.UserAuth;
    if (!user) {
      throw new BadRequestException('invalid password or email');
    }
    if (!auth) {
      throw new InternalServerErrorException();
    }

    const checkPassword = await this.secretService.passwordCheck(
      data.password,
      auth.publicKey,
      auth.secretKey,
    );

    if (!checkPassword) {
      throw new BadRequestException('invalid password or email');
    }
    const accessToken = this.secretService.generateJwt(user.id, 'access');
    const refreshToken = this.secretService.generateJwt(user.id, 'refresh');
    return { accessToken, refreshToken, userId: user.id };
  }
}
