import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AccessTokenPayloadDto, UserResponseDto } from '@degenex/common';
import { EnvironmentVariables } from '../configuration';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<EnvironmentVariables>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: AccessTokenPayloadDto): Promise<UserResponseDto> {
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
