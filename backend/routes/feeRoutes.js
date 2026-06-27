/**
 * @file routes/feeRoutes.js
 * @description Defines /api/fees/* endpoints. Create/update/delete
 * restricted to superadmin; list/reports readable by all authenticated roles.
 * @dependencies express, express-validator, ../controllers/feeController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getFees,
  createFee,
  updateFee,
  deleteFee,
  getOverdueFees,
  getStudentFeeSummary,
  getFeeStats,
} = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getFees);
router.get('/overdue', getOverdueFees);
router.get('/stats', authorize('superadmin'), getFeeStats);
router.get('/student/:id', getStudentFeeSummary);

router.post(
  '/',
  authorize('superadmin'),
  [
    body('student').notEmpty().withMessage('Student is required'),
    body('feeType')
      .isIn(['tuition', 'transport', 'library', 'lab', 'exam', 'activity'])
      .withMessage('Invalid fee type'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('dueDate').isISO8601().withMessage('A valid due date is required'),
  ],
  validate,
  createFee
);

router.put('/:id', authorize('superadmin'), updateFee);
router.delete('/:id', authorize('superadmin'), deleteFee);

module.exports = router;
