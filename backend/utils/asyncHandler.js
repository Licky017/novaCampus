/**
 * @file utils/asyncHandler.js
 * @description Wraps async route handlers/controllers so that any rejected
 * promise or thrown error is automatically forwarded to the global Express
 * error handler, removing the need for repetitive try/catch blocks.
 * @dependencies none
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
