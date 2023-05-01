import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { User } from '@prisma/client';
import { Queue } from 'bull';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth-response.dto';
import { AuthException } from './auth.exception';
import { JwtPayloadDto } from './jwt-payload.dto';
import { QUEUE_NAME } from './send-verification-code.consumer';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { SendVerificationCodeDto } from './send-verification-code.dto';
import { buildVerificationCodeKey } from './send-verification-code.utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectQueue(QUEUE_NAME)
    private sendVerificationCodeQueue: Queue<SendVerificationCodeDto>,
    @InjectRedis()
    private redis: Redis,
  ) {}

  async sendVerificationCode(userEmail: string) {
    await this.sendVerificationCodeQueue.add({ email: userEmail });
  }

  async register(registerDto: RegisterDto) {
    const verificationCode = await this.redis.get(
      buildVerificationCodeKey(registerDto.email),
    );

    if (verificationCode !== registerDto.verificationCode) {
      throw new AuthException('Verification code mismatch');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.createUser({
      email: registerDto.email,
      password: passwordHash,
    });

    return this.generateAuthTokens(user);
  }

  async login(authDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.getUser({ email: authDto.email });

    if (!user) {
      throw new AuthException();
    }

    const isPasswordValid = await bcrypt.compare(
      authDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AuthException();
    }

    return this.generateAuthTokens(user);
  }

  private async generateAuthTokens(user: User): Promise<AuthResponseDto> {
    const jwtPayload: JwtPayloadDto = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: await this.jwtService.signAsync(jwtPayload),
    };
  }
}
