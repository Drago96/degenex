import { Controller, Post, Body, HttpCode, Get, Request } from '@nestjs/common';

import { UserResponseDto } from 'src/users/user-response.dto';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';
import { Public } from './jwt-auth.guard';
import { RegisterDto } from './register.dto';

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
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@Request() req): UserResponseDto {
    return req.user;
  }
}
