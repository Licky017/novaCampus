/**
 * @file models/Teacher.js
 * @description Mongoose schema for teacher records, linked 1:1 with a User
 * document (role='teacher'). Tracks subject/class assignments and HR details.
 * @dependencies mongoose
 */

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    teacherId: { type: String, unique: true }, // e.g. TCH-2024-0001
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    qualification: { type: String, trim: true },
    experience: { type: Number, min: 0, default: 0 },
    salary: { type: Number, min: 0 },
    joiningDate: { type: Date, default: Date.now },
    department: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
