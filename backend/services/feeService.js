/**
 * @file services/feeService.js
 * @description Business logic for fee record CRUD, marking fees as paid with
 * an auto-generated receipt number, overdue lookups, per-student summaries,
 * and aggregate revenue statistics for the dashboard.
 * @dependencies ../models/Fee, ../models/Student, ../utils/generateId
 */

const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { generateReceiptNumber } = require('../utils/generateId');

const listFees = async ({ page = 1, limit = 10, status, studentId }) => {
  const query = {};
  if (status) query.status = status;
  if (studentId) query.student = studentId;

  const total = await Fee.countDocuments(query);
  const fees = await Fee.find(query)
    .populate('student', 'studentId rollNumber')
    .sort({ dueDate: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    fees,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const createFee = async (payload) => Fee.create(payload);

const updateFee = async (id, payload) => {
  const fee = await Fee.findById(id);
  if (!fee) return null;

  Object.assign(fee, payload);

  // Auto-generate a receipt + paid date the moment status flips to 'paid'
  if (payload.status === 'paid' && !fee.receiptNumber) {
    fee.receiptNumber = await generateReceiptNumber(Fee);
    fee.paidDate = fee.paidDate || new Date();
  }

  await fee.save();
  return fee;
};

const deleteFee = async (id) => Fee.findByIdAndDelete(id);

const getOverdueFees = async () => {
  const today = new Date();
  // Auto-flag pending fees past their due date as overdue
  await Fee.updateMany({ status: 'pending', dueDate: { $lt: today } }, { $set: { status: 'overdue' } });
  return Fee.find({ status: 'overdue' }).populate('student', 'studentId rollNumber').sort({ dueDate: 1 });
};

const getStudentFeeSummary = async (studentId) => {
  const fees = await Fee.find({ student: studentId }).sort({ dueDate: -1 });
  const totalDue = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees
    .filter((f) => f.status !== 'paid')
    .reduce((sum, f) => sum + f.amount, 0);

  return { fees, totalDue, totalPaid, totalPending };
};

const getFeeStats = async () => {
  const [paidAgg] = await Fee.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const [pendingAgg] = await Fee.aggregate([
    { $match: { status: { $in: ['pending', 'overdue'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalStudentsWithFees = await Student.countDocuments({ isDeleted: false });

  return {
    totalRevenueCollected: paidAgg?.total || 0,
    totalOutstanding: pendingAgg?.total || 0,
    totalStudentsWithFees,
  };
};

module.exports = {
  listFees,
  createFee,
  updateFee,
  deleteFee,
  getOverdueFees,
  getStudentFeeSummary,
  getFeeStats,
};
