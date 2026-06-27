/**
 * @file utils/generateToken.js
 * @description Generates signed JWT access and refresh tokens for an
 * authenticated user. Access tokens carry { userId, role, email } and are
 * short-lived; refresh tokens carry only { userId } and are long-lived.
 * @dependencies jsonwebtoken
 */

const jwt = require('jsonwebtoken');

const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const generateRefreshToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

module.exports = { generateAccessToken, generateRefreshToken };
