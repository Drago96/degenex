import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
