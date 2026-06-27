/**
 * @file models/Announcement.js
 * @description Mongoose schema for school-wide or role/class-targeted
 * announcements, with priority levels, optional attachments, expiry, and a
 * view counter incremented when a user opens the full announcement.
 * @dependencies mongoose
 */

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: { type: String, required: [true, 'Content is required'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRoles: {
      type: [{ type: String, enum: ['superadmin', 'teacher', 'student'] }],
      required: [true, 'At least one target role is required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one target role is required',
      },
    },
    targetClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    isActive: { type: Boolean, default: true },
    attachments: [{ type: String }],
    expiresAt: { type: Date },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
