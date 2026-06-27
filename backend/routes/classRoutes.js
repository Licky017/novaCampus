/**
 * @file routes/classRoutes.js
 * @description Defines /api/classes/* endpoints, including the roster
 * lookup and the nested "add subject to class" route. Create/update/delete
 * restricted to superadmin.
 * @dependencies express, express-validator, ../controllers/classController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
  getClassStudents,
  addSubjectToClass,
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getClasses);

router.post(
  '/',
  authorize('superadmin'),
  [
    body('name').trim().notEmpty().withMessage('Class name is required'),
    body('grade').isInt({ min: 1, max: 12 }).withMessage('Grade must be between 1 and 12'),
  ],
  validate,
  createClass
);

router.get('/:id', getClassById);
router.put('/:id', authorize('superadmin'), updateClass);
router.delete('/:id', authorize('superadmin'), deleteClass);
router.get('/:id/students', getClassStudents);

router.post(
  '/:id/subjects',
  authorize('superadmin'),
  [
    body('name').trim().notEmpty().withMessage('Subject name is required'),
    body('code').trim().notEmpty().withMessage('Subject code is required'),
  ],
  validate,
  addSubjectToClass
);

module.exports = router;
