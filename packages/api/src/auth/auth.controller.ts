import { Controller, Post, Body, HttpCode, Get, Request } from '@nestjs/common';

import { UserResponseDto } from 'src/users/user-response.dto';
import { AuthCreateDto } from './auth-create.dto';
import { AuthService } from './auth.service';
import { Public } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() authDto: AuthCreateDto) {
    return this.authService.register(authDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() authDto: AuthCreateDto) {
    return this.authService.login(authDto);
  }

  @Get('profile')
  currentUser(@Request() req): UserResponseDto {
    return req.user;
  }
}
