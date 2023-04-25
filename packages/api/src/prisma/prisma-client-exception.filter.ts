import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

const UNIQUE_CONSTRAINT_VIOLATION_CODE = 'P2002';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception.code === UNIQUE_CONSTRAINT_VIOLATION_CODE) {
      const status = HttpStatus.CONFLICT;

      return response.status(status).json({
        statusCode: status,
        message: `Unique constraint violated. Fields: ${exception.meta.target}`,
      });
    }

    super.catch(exception, host);
  }
}
