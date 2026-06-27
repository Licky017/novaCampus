/**
 * @file controllers/dashboardController.js
 * @description Aggregates cross-module data for the three role-based
 * dashboards: headline stats, chart-ready time-series data (enrollment,
 * attendance, revenue), and a unified recent-activity feed.
 * @dependencies ../models/* , ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');

// @route   GET /api/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalStudents, totalTeachers, totalClasses, revenueAgg] = await Promise.all([
    Student.countDocuments({ isDeleted: false }),
    Teacher.countDocuments({ isDeleted: false }),
    Class.countDocuments(),
    Fee.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  return sendResponse(res, 200, true, 'Dashboard stats retrieved successfully', {
    totalStudents,
    totalTeachers,
    totalClasses,
    totalRevenue: revenueAgg[0]?.total || 0,
  });
});

// @route   GET /api/dashboard/charts
const getCharts = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const enrollmentByMonth = await Student.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, isDeleted: false } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const attendanceByMonth = await Attendance.aggregate([
    { $match: { date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const revenueByMonth = await Fee.aggregate([
    { $match: { status: 'paid', paidDate: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$paidDate' } },
        revenue: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return sendResponse(res, 200, true, 'Dashboard chart data retrieved successfully', {
    enrollmentByMonth,
    attendanceByMonth,
    revenueByMonth,
  });
});

// @route   GET /api/dashboard/activity
const getActivity = asyncHandler(async (req, res) => {
  const [recentStudents, recentFees, recentAnnouncements] = await Promise.all([
    Student.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name'),
    Fee.find({ status: 'paid' }).sort({ paidDate: -1 }).limit(10).populate('student', 'studentId'),
    Announcement.find({ isActive: true }).sort({ createdAt: -1 }).limit(10),
  ]);

  const activity = [
    ...recentStudents.map((s) => ({
      type: 'enrollment',
      message: `${s.user?.name || 'A new student'} was enrolled`,
      timestamp: s.createdAt,
    })),
    ...recentFees.map((f) => ({
      type: 'payment',
      message: `Fee payment of ${f.amount} received (${f.student?.studentId || 'student'})`,
      timestamp: f.paidDate || f.updatedAt,
    })),
    ...recentAnnouncements.map((a) => ({
      type: 'announcement',
      message: `New announcement posted: "${a.title}"`,
      timestamp: a.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  return sendResponse(res, 200, true, 'Recent activity retrieved successfully', activity);
});

module.exports = { getStats, getCharts, getActivity };
