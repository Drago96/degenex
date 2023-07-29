import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const UNIQUE_CONSTRAINT_VIOLATION_CODE = 'P2002';
const RECORD_NOT_FOUND_CODE = 'P2025';

function createPrismaErrorPredicate(errorCode: string) {
  return function (error: unknown): error is PrismaClientKnownRequestError {
    return (
      error instanceof PrismaClientKnownRequestError && error.code === errorCode
    );
  };
}

export const isUniqueConstraintError = createPrismaErrorPredicate(UNIQUE_CONSTRAINT_VIOLATION_CODE);
export const isRecordNotFoundError = createPrismaErrorPredicate(RECORD_NOT_FOUND_CODE);
