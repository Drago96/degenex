import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bull';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

import { UsersService } from 'src/users/users.service';
import { EncryptionDto } from 'src/encryption/encryption.dto';
import { EncryptionService } from 'src/encryption/encryption.service';
import { AuthCreateDto } from './auth-create.dto';
import { AuthResponseDto } from './auth-response.dto';
import { AuthException } from './auth.exception';
import { JwtPayloadDto } from './jwt-payload.dto';
import { QUEUE_NAME } from './send-activation-email.consumer';
import { SendActivationEmailDto } from './send-activation-email.dto';
import { ActivationTokenDto } from './activation-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private encryptionService: EncryptionService,
    @InjectQueue(QUEUE_NAME)
    private sendActivationEmailQueue: Queue<SendActivationEmailDto>,
  ) {}

  async register(authDto: AuthCreateDto) {
    const passwordHash = await bcrypt.hash(authDto.password, 10);

    await this.usersService.createUser({
      email: authDto.email,
      password: passwordHash,
    });

    await this.sendActivationEmail(authDto.email);
  }

  async login(authDto: AuthCreateDto): Promise<AuthResponseDto> {
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

    if (user.status === 'Pending') {
      throw new AuthException('User has not been activated');
    }

    const jwtPayload: JwtPayloadDto = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: await this.jwtService.signAsync(jwtPayload),
    };
  }

  async sendActivationEmail(userEmail: string) {
    await this.sendActivationEmailQueue.add({ email: userEmail });
  }

  async activateUser(encryptionDto: EncryptionDto) {
    const activationToken =
      await this.encryptionService.decrypt<ActivationTokenDto>(encryptionDto);

    const hasTokenExpired = moment(activationToken.expirationDate).isBefore(
      moment.now(),
    );

    if (hasTokenExpired) {
      throw new AuthException('Activation token has expired');
    }

    const user = await this.usersService.getUser({
      email: activationToken.email,
    });

    if (!user) {
      throw new AuthException('User does not exist');
    }

    if (user.status !== 'Pending') {
      throw new AuthException('User has already been activated');
    }

    await this.usersService.updateUser(
      { email: activationToken.email },
      { status: 'Active' },
    );
  }
}
