import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

import { isUniqueConstraintError } from './prisma-error.utils';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (isUniqueConstraintError(exception) && exception.meta) {
      const status = HttpStatus.CONFLICT;

      return response.status(status).json({
        statusCode: status,
        message: `Unique constraint violated. Fields: ${exception.meta.target}`,
      });
    }

    super.catch(exception, host);
  }
}
