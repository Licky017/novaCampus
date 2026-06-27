/**
 * @file routes/studentRoutes.js
 * @description Defines /api/students/* endpoints. List/detail accessible to
 * all authenticated roles (controllers/services can be extended to scope
 * student/teacher visibility further); create/update/delete restricted to superadmin.
 * @dependencies express, express-validator, ../controllers/studentController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentGrades,
  getStudentAttendance,
  getStudentFees,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getStudents);

router.post(
  '/',
  authorize('superadmin'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('class').notEmpty().withMessage('Class is required'),
    body('rollNumber').isNumeric().withMessage('Roll number must be numeric'),
  ],
  validate,
  createStudent
);

router.get('/:id', getStudentById);
router.put('/:id', authorize('superadmin'), updateStudent);
router.delete('/:id', authorize('superadmin'), deleteStudent);

router.get('/:id/grades', getStudentGrades);
router.get('/:id/attendance', getStudentAttendance);
router.get('/:id/fees', getStudentFees);

module.exports = router;
