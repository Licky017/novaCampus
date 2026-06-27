/**
 * @file models/Grade.js
 * @description Mongoose schema for an individual exam/assignment grade entry.
 * The letter grade (A+/A/B+/B/C/D/F) is auto-computed from marksObtained and
 * totalMarks on every save via a pre-save hook.
 * @dependencies mongoose, ../utils/calculateGrade
 */

const mongoose = require('mongoose');
const calculateGrade = require('../utils/calculateGrade');

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    examType: {
      type: String,
      enum: ['quiz', 'midterm', 'final', 'assignment', 'project'],
      required: [true, 'Exam type is required'],
    },
    marksObtained: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: 0,
      max: 100,
    },
    totalMarks: { type: Number, default: 100 },
    grade: { type: String },
    academicYear: { type: String, trim: true },
    term: { type: String, enum: ['term1', 'term2', 'term3'] },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  },
  { timestamps: true }
);

gradeSchema.pre('save', function computeLetterGrade(next) {
  this.grade = calculateGrade(this.marksObtained, this.totalMarks);
  next();
});

module.exports = mongoose.model('Grade', gradeSchema);
