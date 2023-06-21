import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(message = 'Conflict') {
    super(message, HttpStatus.CONFLICT);
  }
}
