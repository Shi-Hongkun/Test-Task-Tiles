import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

// Custom error class
export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  }

  // Handle Prisma errors
  else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = 'A record with this data already exists';
        code = 'DUPLICATE_ENTRY';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        code = 'NOT_FOUND';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
        code = 'DATABASE_ERROR';
        break;
    }
  }

  // Handle validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
  }

  // Handle syntax errors (malformed JSON, etc.)
  else if (err instanceof SyntaxError) {
    statusCode = 400;
    message = 'Invalid JSON format';
    code = 'INVALID_JSON';
  }

  // Handle other known errors
  else if (err.message.includes('Cast to ObjectId failed')) {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  }

  const response: ApiResponse = {
    success: false,
    error: message,
    data:
      process.env.NODE_ENV === 'development'
        ? {
            stack: err.stack,
            code: code,
          }
        : undefined,
  };

  res.status(statusCode).json(response);
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: `Route ${req.originalUrl} not found`,
  };
  res.status(404).json(response);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
