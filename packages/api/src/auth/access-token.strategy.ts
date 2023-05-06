import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from 'src/configuration';
import { UserResponseDto } from 'src/users/user-response.dto';
import { AccessTokenPayloadDto } from './access-token-payload.dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<EnvironmentVariables>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: AccessTokenPayloadDto): Promise<UserResponseDto> {
    return { id: payload.sub, email: payload.email, roles: payload.roles };
  }
}
