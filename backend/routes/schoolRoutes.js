/**
 * @file routes/schoolRoutes.js
 * @description School profile routes.
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { getSchools, createSchool, getSchoolById, updateSchool } = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', authorize('superadmin', 'schooladmin'), getSchools);
router.get('/:id', authorize('superadmin', 'schooladmin'), getSchoolById);

router.post(
  '/',
  authorize('superadmin'),
  [
    body('name').trim().notEmpty().withMessage('School name is required'),
    body('code').trim().notEmpty().withMessage('School code is required'),
  ],
  validate,
  createSchool
);

router.put('/:id', authorize('superadmin', 'schooladmin'), updateSchool);

module.exports = router;
