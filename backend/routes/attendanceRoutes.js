/**
 * @file routes/attendanceRoutes.js
 * @description Defines /api/attendance/* endpoints. Marking/updating
 * restricted to teachers and superadmin; reports/list readable by all
 * authenticated roles (student-facing scoping is enforced at the service/
 * controller layer when called from the student's own profile routes).
 * @dependencies express, express-validator, ../controllers/attendanceController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getAttendance,
  markAttendance,
  updateAttendance,
  getStudentReport,
  getClassAttendance,
  getSummary,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getAttendance);
router.get('/summary', getSummary);

router.post(
  '/mark',
  authorize('superadmin', 'teacher'),
  [
    body('classId').notEmpty().withMessage('Class is required'),
    body('date').isISO8601().withMessage('A valid date is required'),
    body('records').isArray({ min: 1 }).withMessage('At least one attendance record is required'),
  ],
  validate,
  markAttendance
);

router.put('/:id', authorize('superadmin', 'teacher'), updateAttendance);
router.get('/report/:studentId', getStudentReport);
router.get('/class/:classId', getClassAttendance);

module.exports = router;
