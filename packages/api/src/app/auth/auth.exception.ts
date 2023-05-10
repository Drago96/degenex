import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(message = 'Authentication failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
