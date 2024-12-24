/**
 * Custom error class for handling application errors.
 * @class AppError
 * @extends {Error}
 */
export class AppError extends Error {
    constructor(public statusCode: number, public message: string) {
      super(message);
      this.name = 'AppError';
      Error.captureStackTrace(this, this.constructor);
    }
  }
