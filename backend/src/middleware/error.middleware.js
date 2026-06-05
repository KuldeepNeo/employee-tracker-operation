export class AppError extends Error {
  constructor(message, statusCode, errors = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || {};

  // Check for SQLite constraint violations
  if (err.code === 'SQLITE_CONSTRAINT' || (err.message && err.message.includes('UNIQUE constraint failed'))) {
    statusCode = 409;
    message = 'Employee code already exists.';
    // Standard validation structure format matching contract
    errors = {
      employee_code: ['Employee code already exists.']
    };
  }

  // Handle other database error codes if necessary
  if (err.code === 'SQLITE_RANGE' || err.code === 'SQLITE_MISMATCH') {
    statusCode = 400;
    message = 'Invalid data input format.';
  }

  // Print stack trace in server console for diagnostic purposes
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] Code: ${statusCode} | Path: ${req.method} ${req.path}`);
    console.error(err.stack || err);
  }

  // Prepare client payload (obscure native stack details in production)
  const isProduction = process.env.NODE_ENV === 'production';
  const cleanMessage = (statusCode === 500 && isProduction) 
    ? 'Unable to process request.' 
    : message;

  res.status(statusCode).json({
    success: false,
    message: cleanMessage,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  });
}
