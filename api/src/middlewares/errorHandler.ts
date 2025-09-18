import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

// Global error handler middleware
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send error response
  res.status(statusCode).json({
    status: statusCode,
    message,
  });

  // Log the error for internal tracking (optional)
  console.error(err.stack);
};
