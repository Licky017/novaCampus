/**
 * @file controllers/authController.js
 * @description Handles registration, login/logout, current-user retrieval,
 * access-token refresh, password change, and the forgot/reset password flow.
 * Issues JWT access + refresh tokens on successful login.
 * @dependencies jsonwebtoken, crypto, ../models/User, ../utils/generateToken,
 *               ../utils/sendResponse, ../utils/sendEmail, ../utils/asyncHandler
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Invitation = require('../models/Invitation');

const hashInviteToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// @route   POST /api/auth/register
// @access  Private (superadmin only — enforced by roleMiddleware on the route)
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendResponse(res, 409, false, 'A user with this email already exists');
  }

  if (role === 'superadmin' && req.user.role !== 'superadmin') {
    return sendResponse(res, 403, false, 'Only a super admin can create another super admin');
  }

  const user = await User.create({ name, email, password, role, phone, address });

  return sendResponse(res, 201, true, 'User registered successfully', user.toSafeObject());
});

// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return sendResponse(res, 400, false, 'Passwords do not match');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendResponse(res, 409, false, 'A user with this email already exists');
  }

  const fullName = `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim();
  if (!fullName) {
    return sendResponse(res, 400, false, 'First name and last name are required');
  }

  const user = await User.create({ name: fullName, email, password, role: 'student' });

  return sendResponse(res, 201, true, 'Registration successful', user.toSafeObject());
});

// @route   POST /api/auth/invites
// @access  Private (superadmin or schooladmin; schooladmin may invite teacher/student only)
const createInvite = asyncHandler(async (req, res) => {
  const { name, email, role, metadata = {} } = req.body;

  if (role === 'schooladmin' && req.user.role !== 'superadmin') {
    return sendResponse(res, 403, false, 'Only a super admin can invite school admins');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendResponse(res, 409, false, 'A user with this email already exists');
  }

  await Invitation.updateMany(
    { email: email.toLowerCase(), acceptedAt: { $exists: false } },
    { $set: { acceptedAt: new Date() } }
  );

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashInviteToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  const invite = await Invitation.create({
    name,
    email,
    role,
    tokenHash,
    invitedBy: req.user._id,
    expiresAt,
    metadata,
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const inviteLink = `${frontendUrl}/accept-invite/${token}`;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await sendEmail({
      to: email,
      subject: 'You are invited to join Nova Campus',
      html: `<p>Hello ${name},</p><p>You have been invited to join Nova Campus as a ${role}.</p><p><a href="${inviteLink}">Accept your invitation</a></p><p>This link expires in 7 days.</p>`,
    });
  }

  return sendResponse(res, 201, true, 'Invitation created successfully', {
    invite: {
      id: invite._id,
      name: invite.name,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
    },
    inviteLink,
  });
});

// @route   GET /api/auth/invites/:token
// @access  Public
const verifyInvite = asyncHandler(async (req, res) => {
  const invite = await Invitation.findOne({
    tokenHash: hashInviteToken(req.params.token),
    acceptedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).select('+tokenHash');

  if (!invite) {
    return sendResponse(res, 404, false, 'Invitation is invalid or has expired');
  }

  return sendResponse(res, 200, true, 'Invitation is valid', {
    name: invite.name,
    email: invite.email,
    role: invite.role,
  });
});

// @route   POST /api/auth/invites/:token/accept
// @access  Public
const acceptInvite = asyncHandler(async (req, res) => {
  const { password, phone, address } = req.body;
  const invite = await Invitation.findOne({
    tokenHash: hashInviteToken(req.params.token),
    acceptedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).select('+tokenHash');

  if (!invite) {
    return sendResponse(res, 404, false, 'Invitation is invalid or has expired');
  }

  const existingUser = await User.findOne({ email: invite.email });
  if (existingUser) {
    return sendResponse(res, 409, false, 'A user with this email already exists');
  }

  const user = await User.create({
    name: invite.name,
    email: invite.email,
    role: invite.role,
    password,
    phone,
    address,
  });

  invite.acceptedAt = new Date();
  await invite.save();

  return sendResponse(res, 201, true, 'Invitation accepted successfully', user.toSafeObject());
});

// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    return sendResponse(res, 401, false, 'Invalid email or password');
  }

  if (!user.isActive) {
    return sendResponse(res, 403, false, 'This account has been deactivated');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 200, true, 'Login successful', {
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  });
});

// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie('token');
  return sendResponse(res, 200, true, 'Logged out successfully');
});

// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Current user retrieved successfully', req.user.toSafeObject());
});

// @route   POST /api/auth/refresh-token
// @access  Public (requires a valid, previously-issued refresh token)
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) return sendResponse(res, 401, false, 'Refresh token is required');

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return sendResponse(res, 401, false, 'Invalid refresh token');
    }

    const newAccessToken = generateAccessToken(user);
    return sendResponse(res, 200, true, 'Access token refreshed', { accessToken: newAccessToken });
  } catch (error) {
    return sendResponse(res, 401, false, 'Refresh token is invalid or has expired');
  }
});

// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return sendResponse(res, 401, false, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return sendResponse(res, 200, true, 'Password changed successfully');
});

// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return the same message, whether or not the email exists, to avoid leaking account info
  const genericMessage = 'If that email exists in our system, a password reset link has been sent';
  if (!user) return sendResponse(res, 200, true, genericMessage);

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request — School Management System',
      html: `<p>You requested a password reset. This link expires in 30 minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can safely ignore this email.</p>`,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return sendResponse(res, 500, false, 'Email could not be sent, please try again later');
  }

  return sendResponse(res, 200, true, genericMessage);
});

// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return sendResponse(res, 400, false, 'Reset token is invalid or has expired');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return sendResponse(res, 200, true, 'Password reset successfully — you may now log in');
});

module.exports = {
  register,
  signup,
  login,
  logout,
  getMe,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  createInvite,
  verifyInvite,
  acceptInvite,
};
