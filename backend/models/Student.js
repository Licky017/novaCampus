/**
 * @file models/Student.js
 * @description Mongoose schema for student academic records. Linked 1:1 with
 * a User document (role='student'). Supports soft-delete instead of hard
 * removal so historical academic records remain intact.
 * @dependencies mongoose
 */

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentId: { type: String, unique: true }, // e.g. SMS-2024-0001
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    rollNumber: { type: Number, required: [true, 'Roll number is required'] },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    feeStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
    },
    admissionDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

studentSchema.index({ class: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
