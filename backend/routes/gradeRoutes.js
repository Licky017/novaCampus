/**
 * @file routes/gradeRoutes.js
 * @description Defines /api/grades/* endpoints. Entry/update/delete
 * restricted to teachers and superadmin; list/reports readable by all
 * authenticated roles.
 * @dependencies express, express-validator, ../controllers/gradeController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  getStudentReport,
  getClassReport,
} = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getGrades);

router.post(
  '/',
  authorize('superadmin', 'schooladmin', 'teacher'),
  [
    body('student').notEmpty().withMessage('Student is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('class').notEmpty().withMessage('Class is required'),
    body('examType')
      .isIn(['quiz', 'midterm', 'final', 'assignment', 'project'])
      .withMessage('Invalid exam type'),
    body('marksObtained').isFloat({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
  ],
  validate,
  createGrade
);

router.put('/:id', authorize('superadmin', 'schooladmin', 'teacher'), updateGrade);
router.delete('/:id', authorize('superadmin', 'schooladmin', 'teacher'), deleteGrade);
router.get('/report/:studentId', getStudentReport);
router.get('/class/:classId', getClassReport);

module.exports = router;
