import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { User } from '@prisma/client';
import { Queue } from 'bull';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';

import { EnvironmentVariables } from '../configuration';
import { PrismaService } from '../prisma/prisma.service';
import { AccessTokenPayloadDto } from './access-token-payload.dto';
import { AuthResultDto } from './auth-result.dto';
import { AuthException } from './auth.exception';
import { QUEUE_NAME } from './send-verification-code.consumer';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';
import { SendVerificationCodeDto } from './send-verification-code.dto';
import { buildVerificationCodeKey } from './send-verification-code.utils';
import { RefreshTokenPayloadDto } from './refresh-token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    @InjectQueue(QUEUE_NAME)
    private readonly sendVerificationCodeQueue: Queue<SendVerificationCodeDto>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async deleteExpiredRefreshTokens() {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          gt: moment().toDate(),
        },
      },
    });
  }

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

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: passwordHash,
      },
    });

    return this.generateAuthTokens(user);
  }

  async login(authDto: LoginDto): Promise<AuthResultDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });

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

  async refresh(refreshToken: string): Promise<AuthResultDto> {
    const refreshTokenPayload = await this.verifyRefreshToken(refreshToken);

    const storedRefreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: refreshTokenPayload.sub,
        token: refreshToken,
        sessionId: refreshTokenPayload.sessionId,
        expiresAt: {
          gte: moment().toDate(),
        },
      },
    });

    const isRefreshTokenReusedOrExpired = storedRefreshToken === null;

    if (isRefreshTokenReusedOrExpired) {
      await this.prisma.refreshToken.deleteMany({
        where: {
          sessionId: refreshTokenPayload.sessionId,
        },
      });

      throw new AuthException('Refresh token integrity compromised');
    }

    await this.prisma.refreshToken.deleteMany({
      where: {
        sessionId: refreshTokenPayload.sessionId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: refreshTokenPayload.sub },
    });

    return this.generateAuthTokens(user, refreshTokenPayload.sessionId);
  }

  async clearSession(refreshToken: string) {
    const refreshTokenPayload = await this.verifyRefreshToken(refreshToken);

    await this.prisma.refreshToken.deleteMany({
      where: {
        sessionId: refreshTokenPayload.sessionId,
      },
    });
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync<RefreshTokenPayloadDto>(
        refreshToken,
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        },
      );
    } catch (error) {
      throw new AuthException('Invalid refresh token');
    }
  }

  private async generateAuthTokens(
    user: User,
    sessionId: string = null,
  ): Promise<AuthResultDto> {
    const accessTokenPayload: AccessTokenPayloadDto = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: '3m',
    });

    const refreshTokenPayload: RefreshTokenPayloadDto = {
      sub: user.id,
      sessionId: sessionId || randomUUID(),
    };

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        sessionId: refreshTokenPayload.sessionId,
        expiresAt: moment().add(7, 'days').toDate(),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
