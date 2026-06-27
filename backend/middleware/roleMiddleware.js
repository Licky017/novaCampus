/**
 * @file middleware/roleMiddleware.js
 * @description Restricts a route to a given set of roles by checking
 * req.user.role (set earlier by authMiddleware.protect) against an allowed list.
 * @dependencies ../utils/sendResponse
 */

const sendResponse = require('../utils/sendResponse');

/**
 * @param  {...string} allowedRoles - e.g. authorize('superadmin', 'teacher')
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return sendResponse(res, 403, false, 'Forbidden: you do not have permission to perform this action');
  }
  next();
};

module.exports = { authorize };
