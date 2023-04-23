import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor() {
    super('Authentication Failed', HttpStatus.BAD_REQUEST);
  }
}
