/**
 * @file models/Fee.js
 * @description Mongoose schema for a student fee record (tuition, transport,
 * library, lab, exam, or activity fees), tracking payment status and a
 * unique auto-generated receipt number once paid.
 * @dependencies mongoose
 */

const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    feeType: {
      type: String,
      enum: ['tuition', 'transport', 'library', 'lab', 'exam', 'activity'],
      required: [true, 'Fee type is required'],
    },
    amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
    dueDate: { type: Date, required: [true, 'Due date is required'] },
    paidDate: { type: Date },
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cash', 'online', 'cheque'] },
    receiptNumber: { type: String, unique: true, sparse: true },
    academicYear: { type: String, trim: true },
    month: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);
