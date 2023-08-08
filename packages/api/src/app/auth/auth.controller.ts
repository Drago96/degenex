import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { Response, Request } from 'express';
import moment from 'moment';

import {
  AuthDto,
  AuthResponseDto,
  RegisterDto,
  SendVerificationCodeDto,
  UserResponseDto,
} from '@degenex/common';
import { AuthService } from './auth.service';
import { AccessTokenAuthGuard } from './access-token-auth.guard';
import { RequestWithUser } from '@/types/request-with-user';

const REFRESH_TOKEN_COOKIE_KEY = 'refresh-token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-verification-code')
  @HttpCode(204)
  async activateUser(@Body() sendVerificationCodeDto: SendVerificationCodeDto) {
    await this.authService.sendVerificationCode(sendVerificationCodeDto.email);
  }

  @Post('register')
  @ZodSerializerDto(AuthResponseDto)
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() registerDto: RegisterDto,
  ): Promise<AuthResponseDto> {
    const authResult = await this.authService.register(registerDto);

    this.setRefreshTokenCookie(response, authResult.refreshToken);

    return { accessToken: authResult.accessToken };
  }

  @Post('login')
  @HttpCode(200)
  @ZodSerializerDto(AuthResponseDto)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() authDto: AuthDto,
  ): Promise<AuthResponseDto> {
    const authResult = await this.authService.login(authDto);

    this.setRefreshTokenCookie(response, authResult.refreshToken);

    return { accessToken: authResult.accessToken };
  }

  @Post('refresh')
  @HttpCode(200)
  @ZodSerializerDto(AuthResponseDto)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_KEY];

    const authResult = await this.authService.refresh(refreshToken);

    this.setRefreshTokenCookie(response, authResult.refreshToken);

    return { accessToken: authResult.accessToken };
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_KEY];

    if (!refreshToken) {
      return;
    }

    await this.authService.clearSession(refreshToken);

    response.clearCookie(REFRESH_TOKEN_COOKIE_KEY);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('profile')
  @ZodSerializerDto(UserResponseDto)
  getProfile(@Req() req: RequestWithUser): UserResponseDto {
    return req.user;
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string) {
    response.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      httpOnly: true,
      secure: true,
      expires: moment().add(7, 'days').toDate(),
    });
  }
}
