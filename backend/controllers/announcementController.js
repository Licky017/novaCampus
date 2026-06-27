/**
 * @file controllers/announcementController.js
 * @description Thin HTTP layer for announcement endpoints, delegating
 * business logic to services/announcementService.js. Listing is automatically
 * filtered by the requesting user's role and class.
 * @dependencies ../services/announcementService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const announcementService = require('../services/announcementService');

// @route   GET /api/announcements
const getAnnouncements = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, classId } = req.query;
  const { announcements, pagination } = await announcementService.listAnnouncements({
    page,
    limit,
    role: req.user.role,
    classId,
  });
  return sendResponse(res, 200, true, 'Announcements retrieved successfully', announcements, pagination);
});

// @route   POST /api/announcements
const createAnnouncement = asyncHandler(async (req, res) => {
  const payload = { ...req.body, author: req.user._id };
  const announcement = await announcementService.createAnnouncement(payload);
  return sendResponse(res, 201, true, 'Announcement created successfully', announcement);
});

// @route   GET /api/announcements/:id
const getAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await announcementService.getAnnouncementById(req.params.id);
  if (!announcement) return sendResponse(res, 404, false, 'Announcement not found');
  return sendResponse(res, 200, true, 'Announcement retrieved successfully', announcement);
});

// @route   PUT /api/announcements/:id
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
  if (!announcement) return sendResponse(res, 404, false, 'Announcement not found');
  return sendResponse(res, 200, true, 'Announcement updated successfully', announcement);
});

// @route   DELETE /api/announcements/:id (deactivate)
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementService.deleteAnnouncement(req.params.id);
  if (!announcement) return sendResponse(res, 404, false, 'Announcement not found');
  return sendResponse(res, 200, true, 'Announcement deactivated successfully');
});

module.exports = { getAnnouncements, createAnnouncement, getAnnouncementById, updateAnnouncement, deleteAnnouncement };
