/**
 * @file routes/subjectRoutes.js
 * @description Defines /api/subjects/* endpoints for direct subject CRUD
 * (independent of the nested POST /api/classes/:id/subjects route).
 * Create/update/delete restricted to superadmin and schooladmin.
 * @dependencies express, express-validator, ../controllers/subjectController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getSubjects,
  createSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getSubjects);

router.post(
  '/',
  authorize('superadmin', 'schooladmin'),
  [
    body('name').trim().notEmpty().withMessage('Subject name is required'),
    body('code').trim().notEmpty().withMessage('Subject code is required'),
  ],
  validate,
  createSubject
);

router.get('/:id', getSubjectById);
router.put('/:id', authorize('superadmin', 'schooladmin'), updateSubject);
router.delete('/:id', authorize('superadmin', 'schooladmin'), deleteSubject);

module.exports = router;
