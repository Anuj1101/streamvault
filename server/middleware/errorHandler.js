import logger from '../utils/logger.js';
import { ValidationError } from '../validators/urlValidator.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error [${req.method} ${req.originalUrl}]:`, { message: err.message });

  // Handle client validation errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message
    });
  }

  // Handle custom known client errors
  if (err.statusCode && err.statusCode < 500) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Default server error - NEVER expose internal traces or sensitive server paths to client
  res.status(500).json({
    success: false,
    error: err.message || 'An unexpected error occurred while processing your media request.'
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found.'
  });
}
