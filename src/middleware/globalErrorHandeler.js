import { ZodError } from 'zod';
import AppError from '../app/errorHelpers/appError.js';
import handleZodError from '../app/errorHelpers/handleZodErrors.js';
import envVars from '../config/env.js';

export const globalErrorHandeler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorSources = [
    {
      path: '',
      message: err?.message || 'Something went wrong!',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err.name === 'ValidationError') {
    // Mongoose Validation Error
    statusCode = 400;
    message = 'Validation Error';
    errorSources = Object.values(err.errors).map((val) => ({
      path: val?.path,
      message: val?.message,
    }));
  } else if (err.name === 'CastError') {
    // Mongoose Cast Error (Invalid ObjectId)
    statusCode = 400;
    message = 'Invalid ID Format';
    errorSources = [
      {
        path: err?.path,
        message: `Invalid ${err?.path}: ${err?.value}`,
      },
    ];
  } else if (err.code === 11000) {
    // Mongoose Duplicate Key Error
    statusCode = 400;
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    message = 'Duplicate Field Value';
    errorSources = [
      {
        path: '',
        message: `${extractedMessage || 'Field value'} already exists!`,
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: envVars.env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandeler;
