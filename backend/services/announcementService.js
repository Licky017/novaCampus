/**
 * @file services/announcementService.js
 * @description Business logic for announcements: role/class-filtered
 * listing, view-count increment on read, and standard CRUD.
 * @dependencies ../models/Announcement
 */

const Announcement = require('../models/Announcement');

const listAnnouncements = async ({ page = 1, limit = 10, role, classId }) => {
  const query = { isActive: true };

  if (role) query.targetRoles = role;
  if (classId) {
    query.$or = [{ targetClasses: classId }, { targetClasses: { $size: 0 } }];
  }

  // Exclude expired announcements
  query.$and = [{ $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }] }];

  const total = await Announcement.countDocuments(query);
  const announcements = await Announcement.find(query)
    .populate('author', 'name role avatar')
    .populate('targetClasses', 'name')
    .sort({ priority: -1, createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    announcements,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const createAnnouncement = async (payload) => Announcement.create(payload);

const getAnnouncementById = async (id) => {
  const announcement = await Announcement.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    .populate('author', 'name role avatar')
    .populate('targetClasses', 'name');
  return announcement;
};

const updateAnnouncement = async (id, payload) =>
  Announcement.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

const deleteAnnouncement = async (id) =>
  Announcement.findByIdAndUpdate(id, { isActive: false }, { new: true });

module.exports = {
  listAnnouncements,
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
