import HttpStatus from "../config/httpStatus";

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Sets the name of the error class
    Error.captureStackTrace(this, this.constructor); // Captures the stack trace
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND); // HTTP 404 Not Found
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST); // HTTP 404 Not Found
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED); // HTTP 401 Unauthorized
  }
}
