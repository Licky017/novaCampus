/**
 * @file controllers/gradeController.js
 * @description Thin HTTP layer for grade endpoints, delegating business
 * logic to services/gradeService.js.
 * @dependencies ../services/gradeService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const gradeService = require('../services/gradeService');

// @route   GET /api/grades
const getGrades = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, studentId, subjectId, term } = req.query;
  const { grades, pagination } = await gradeService.listGrades({ page, limit, studentId, subjectId, term });
  return sendResponse(res, 200, true, 'Grades retrieved successfully', grades, pagination);
});

// @route   POST /api/grades
const createGrade = asyncHandler(async (req, res) => {
  const payload = { ...req.body, enteredBy: req.body.enteredBy || req.user._id };
  const grade = await gradeService.createGrade(payload);
  return sendResponse(res, 201, true, 'Grade entered successfully', grade);
});

// @route   PUT /api/grades/:id
const updateGrade = asyncHandler(async (req, res) => {
  const grade = await gradeService.updateGrade(req.params.id, req.body);
  if (!grade) return sendResponse(res, 404, false, 'Grade not found');
  return sendResponse(res, 200, true, 'Grade updated successfully', grade);
});

// @route   DELETE /api/grades/:id
const deleteGrade = asyncHandler(async (req, res) => {
  const grade = await gradeService.deleteGrade(req.params.id);
  if (!grade) return sendResponse(res, 404, false, 'Grade not found');
  return sendResponse(res, 200, true, 'Grade deleted successfully');
});

// @route   GET /api/grades/report/:studentId
const getStudentReport = asyncHandler(async (req, res) => {
  const transcript = await gradeService.getStudentTranscript(req.params.studentId);
  return sendResponse(res, 200, true, 'Student transcript generated successfully', transcript);
});

// @route   GET /api/grades/class/:classId
const getClassReport = asyncHandler(async (req, res) => {
  const report = await gradeService.getClassPerformanceReport(req.params.classId);
  return sendResponse(res, 200, true, 'Class performance report generated successfully', report);
});

module.exports = { getGrades, createGrade, updateGrade, deleteGrade, getStudentReport, getClassReport };
