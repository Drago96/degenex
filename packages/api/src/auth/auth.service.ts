import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { AuthCreateDto } from './auth-create.dto';
import { AuthResponseDto } from './auth-response.dto';
import { AuthException } from './auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(authDto: AuthCreateDto): Promise<AuthResponseDto> {
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(authDto.password, saltOrRounds);

    const user = await this.usersService.createUser({
      email: authDto.email,
      password: passwordHash,
    });

    const payload = this.generateJwtPayload(user);

    return {
      accessToken: this.jwtService.sign(payload),
    };
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

    const payload = this.generateJwtPayload(user);

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  generateJwtPayload(user: User) {
    return { sub: user.id, email: user.email };
  }
}
