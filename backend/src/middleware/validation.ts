import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ValidationError } from '../types';

// Validation helper function
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError[] = [];

    for (const field of fields) {
      const value = req.body[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        errors.push({
          field,
          message: `${field} is required`,
        });
      }
    }

    if (errors.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        data: { errors },
      };
      return res.status(400).json(response);
    }

    next();
  };
};

// Validate board creation
export const validateCreateBoard = validateRequired(['name']);

// Validate column creation
export const validateCreateColumn = validateRequired(['name', 'boardId']);

// Validate task creation
export const validateCreateTask = validateRequired(['title', 'columnId']);

// Validate position update
export const validatePositionUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { position } = req.body;

  if (typeof position !== 'number' || position < 0) {
    const response: ApiResponse = {
      success: false,
      error: 'Valid position is required',
    };
    return res.status(400).json(response);
  }

  next();
};

// Validate task position update (requires both columnId and position)
export const validateTaskPositionUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { columnId, position } = req.body;

  if (!columnId || typeof position !== 'number' || position < 0) {
    const response: ApiResponse = {
      success: false,
      error: 'Valid columnId and position are required',
    };
    return res.status(400).json(response);
  }

  next();
};

// Validate UUID format
export const validateUUID = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[param];
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!id || !uuidRegex.test(id)) {
      const response: ApiResponse = {
        success: false,
        error: `Invalid ${param} format`,
      };
      return res.status(400).json(response);
    }

    next();
  };
};

// Validate CUID format (since we're using Prisma's cuid())
export const validateCUID = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[param];
    const cuidRegex = /^c[0-9a-z]{24}$/i;

    if (!id || !cuidRegex.test(id)) {
      const response: ApiResponse = {
        success: false,
        error: `Invalid ${param} format`,
      };
      return res.status(400).json(response);
    }

    next();
  };
};
