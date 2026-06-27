/**
 * @file utils/sendResponse.js
 * @description Standardised JSON response builder used by every controller so
 * that all API responses follow the exact same shape:
 * { success: bool, message: string, data: any, pagination?: {...} }
 * @dependencies none
 */

const sendResponse = (res, statusCode, success, message, data = null, pagination = null) => {
  const payload = { success, message, data };
  if (pagination) payload.pagination = pagination;
  return res.status(statusCode).json(payload);
};

module.exports = sendResponse;
