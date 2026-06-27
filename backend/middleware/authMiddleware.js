/**
 * @file middleware/authMiddleware.js
 * @description Verifies the JWT access token on protected routes (from the
 * Authorization header or an httpOnly cookie) and attaches the authenticated
 * user document to req.user for downstream handlers.
 * @dependencies jsonwebtoken, ../models/User, ../utils/asyncHandler, ../utils/sendResponse
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return sendResponse(res, 401, false, 'Not authorized, user no longer exists');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, false, 'This account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Not authorized, token is invalid or has expired');
  }
});

module.exports = { protect };
