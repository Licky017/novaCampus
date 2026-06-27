/**
 * @file middleware/errorHandler.js
 * @description Global Express error-handling middleware. Normalises Mongoose
 * CastErrors, ValidationErrors, and duplicate-key (11000) errors into
 * standardised JSON responses. Also exports a 404 "notFound" handler for
 * unmatched routes. Must be registered last, after all routers.
 * @dependencies ../utils/sendResponse
 */

const sendResponse = require('../utils/sendResponse');

const notFound = (req, res) => {
  sendResponse(res, 404, false, `Route not found: ${req.method} ${req.originalUrl}`);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for field: ${field}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  return sendResponse(
    res,
    statusCode,
    false,
    message,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};

module.exports = { notFound, errorHandler };
