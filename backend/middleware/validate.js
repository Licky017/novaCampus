/**
 * @file middleware/validate.js
 * @description Runs after an express-validator validation chain on a route.
 * Collects any validation errors and returns a standardised 422 response
 * instead of letting the request hit the controller with bad data.
 * @dependencies express-validator, ../utils/sendResponse
 */

const { validationResult } = require('express-validator');
const sendResponse = require('../utils/sendResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendResponse(res, 422, false, 'Validation failed', formattedErrors);
  }

  next();
};

module.exports = validate;
