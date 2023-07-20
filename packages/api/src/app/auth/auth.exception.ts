import { BadRequestException } from '@nestjs/common';

export class AuthException extends BadRequestException {
  constructor(message = 'Authentication failed') {
    super(message);
  }
}
