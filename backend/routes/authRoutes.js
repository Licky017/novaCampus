/**
 * @file routes/authRoutes.js
 * @description Defines /api/auth/* endpoints: register (admin-only),
 * login, logout, current-user, token refresh, change/forgot/reset password.
 * @dependencies express, express-validator, ../controllers/authController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
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
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.post(
  '/register',
  protect,
  authorize('superadmin'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['superadmin', 'schooladmin', 'teacher', 'student']).withMessage('Invalid role'),
  ],
  validate,
  register
);

router.post(
  '/signup',
  [
    body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords must match'),
  ],
  validate,
  signup
);

router.post(
  '/invites',
  protect,
  authorize('superadmin', 'schooladmin'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('role').isIn(['schooladmin', 'teacher', 'student']).withMessage('Invalid invite role'),
  ],
  validate,
  createInvite
);

router.get('/invites/:token', verifyInvite);

router.post(
  '/invites/:token/accept',
  [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').optional().matches(/^[\d+\-\s()]{7,20}$/).withMessage('Please provide a valid phone number'),
  ],
  validate,
  acceptInvite
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh-token', refreshAccessToken);

router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  validate,
  changePassword
);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('A valid email is required')],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  validate,
  resetPassword
);

module.exports = router;
