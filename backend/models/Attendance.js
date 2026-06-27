/**
 * @file models/Attendance.js
 * @description Mongoose schema for a single student's daily attendance
 * record. Enforces one record per student per day via a compound unique index.
 * @dependencies mongoose
 */

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: [true, 'Date is required'] },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: [true, 'Status is required'],
    },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
