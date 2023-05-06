import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { UserResponseDto } from 'src/users/user-response.dto';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';
import { Public } from './access-token-auth.guard';
import { RegisterDto } from './register.dto';

const REFRESH_TOKEN_COOKIE_KEY = 'refresh-token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-verification-code')
  @HttpCode(204)
  async activateUser(@Body('email') email: string) {
    await this.authService.sendVerificationCode(email);
  }

  @Public()
  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() registerDto: RegisterDto,
  ) {
    const authResult = await this.authService.register(registerDto);

    this.setRefreshTokenCookie(response, authResult.refreshToken);

    return { accessToken: authResult.accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    const authResult = await this.authService.login(loginDto);

    this.setRefreshTokenCookie(response, authResult.refreshToken);

    return { accessToken: authResult.accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_KEY];

    const authResult = await this.authService.refresh(refreshToken);

    this.setRefreshTokenCookie(response, authResult.refreshToken);

    return { accessToken: authResult.accessToken };
  }

  @Public()
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

  @Get('profile')
  getProfile(@Req() req): UserResponseDto {
    return req.user;
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string) {
    response.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      httpOnly: true,
      secure: true,
    });
  }
}
