/**
 * @file routes/teacherRoutes.js
 * @description Defines /api/teachers/* endpoints. Create/update/delete
 * restricted to superadmin; list/detail accessible to all authenticated roles.
 * @dependencies express, express-validator, ../controllers/teacherController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherClasses,
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getTeachers);

router.post(
  '/',
  authorize('superadmin'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  createTeacher
);

router.get('/:id', getTeacherById);
router.put('/:id', authorize('superadmin'), updateTeacher);
router.delete('/:id', authorize('superadmin'), deleteTeacher);
router.get('/:id/classes', getTeacherClasses);

module.exports = router;
