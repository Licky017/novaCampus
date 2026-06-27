/**
 * @file routes/announcementRoutes.js
 * @description Defines /api/announcements/* endpoints. Create/update
 * restricted to superadmin and teacher; delete (deactivate) restricted to
 * superadmin; list/detail readable by all authenticated roles (auto-filtered
 * by role in the service layer).
 * @dependencies express, express-validator, ../controllers/announcementController,
 *               ../middleware/authMiddleware, ../middleware/roleMiddleware, ../middleware/validate
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getAnnouncements,
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getAnnouncements);

router.post(
  '/',
  authorize('superadmin', 'teacher'),
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (max 200 chars)'),
    body('content').notEmpty().withMessage('Content is required'),
    body('targetRoles')
      .isArray({ min: 1 })
      .withMessage('At least one target role is required'),
  ],
  validate,
  createAnnouncement
);

router.get('/:id', getAnnouncementById);
router.put('/:id', authorize('superadmin', 'teacher'), updateAnnouncement);
router.delete('/:id', authorize('superadmin'), deleteAnnouncement);

module.exports = router;
