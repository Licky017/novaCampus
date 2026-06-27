/**
 * @file controllers/attendanceController.js
 * @description Thin HTTP layer for attendance endpoints, delegating
 * business logic to services/attendanceService.js.
 * @dependencies ../services/attendanceService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const attendanceService = require('../services/attendanceService');

// @route   GET /api/attendance
const getAttendance = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, classId, date, studentId } = req.query;
  const { records, pagination } = await attendanceService.listAttendance({ page, limit, classId, date, studentId });
  return sendResponse(res, 200, true, 'Attendance records retrieved successfully', records, pagination);
});

// @route   POST /api/attendance/mark
const markAttendance = asyncHandler(async (req, res) => {
  const { classId, date, records } = req.body;
  const result = await attendanceService.markClassAttendance({
    classId,
    date,
    records,
    markedBy: req.user._id,
  });
  return sendResponse(res, 200, true, 'Attendance marked successfully', result);
});

// @route   PUT /api/attendance/:id
const updateAttendance = asyncHandler(async (req, res) => {
  const record = await attendanceService.updateAttendance(req.params.id, req.body);
  if (!record) return sendResponse(res, 404, false, 'Attendance record not found');
  return sendResponse(res, 200, true, 'Attendance record updated successfully', record);
});

// @route   GET /api/attendance/report/:studentId
const getStudentReport = asyncHandler(async (req, res) => {
  const report = await attendanceService.getStudentAttendanceReport(req.params.studentId);
  return sendResponse(res, 200, true, 'Attendance report generated successfully', report);
});

// @route   GET /api/attendance/class/:classId
const getClassAttendance = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const records = await attendanceService.getClassAttendanceRange(req.params.classId, startDate, endDate);
  return sendResponse(res, 200, true, 'Class attendance retrieved successfully', records);
});

// @route   GET /api/attendance/summary
const getSummary = asyncHandler(async (req, res) => {
  const summary = await attendanceService.getAttendanceSummary();
  return sendResponse(res, 200, true, "Today's attendance summary retrieved", summary);
});

module.exports = {
  getAttendance,
  markAttendance,
  updateAttendance,
  getStudentReport,
  getClassAttendance,
  getSummary,
};
