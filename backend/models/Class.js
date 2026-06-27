/**
 * @file models/Class.js
 * @description Mongoose schema for a class/section (e.g. "Grade 10-A"),
 * tracking its roster, assigned subjects, and homeroom teacher.
 * @dependencies mongoose
 */

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Class name is required'], trim: true },
    grade: {
      type: Number,
      required: [true, 'Grade is required'],
      min: 1,
      max: 12,
    },
    section: { type: String, trim: true, uppercase: true },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    academicYear: { type: String, trim: true, default: () => `${new Date().getFullYear()}-${new Date().getFullYear() + 1}` },
    capacity: { type: Number, default: 40 },
    room: { type: String, trim: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  },
  { timestamps: true }
);

classSchema.index({ name: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
