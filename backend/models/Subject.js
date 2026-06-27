/**
 * @file models/Subject.js
 * @description Mongoose schema for a subject taught within a class, with an
 * assigned teacher and unique subject code (e.g. MATH101).
 * @dependencies mongoose
 */

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Subject name is required'], trim: true },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    description: { type: String, trim: true },
    credits: { type: Number, default: 1, min: 0 },
    isElective: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
