import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor() {
    super('Authentication failed', HttpStatus.BAD_REQUEST);
  }
}
