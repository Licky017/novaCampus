/**
 * @file controllers/studentController.js
 * @description Thin HTTP layer for student endpoints — validates nothing
 * itself (that's done by middleware/validate.js), delegates all business
 * logic to services/studentService.js, and returns standardised responses.
 * @dependencies ../services/studentService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const studentService = require('../services/studentService');

// @route   GET /api/students
const getStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', classId, feeStatus } = req.query;
  const { students, pagination } = await studentService.listStudents({ page, limit, search, classId, feeStatus });
  return sendResponse(res, 200, true, 'Students retrieved successfully', students, pagination);
});

// @route   POST /api/students
const createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  return sendResponse(res, 201, true, 'Student created successfully', student);
});

// @route   GET /api/students/:id
const getStudentById = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  if (!student) return sendResponse(res, 404, false, 'Student not found');
  return sendResponse(res, 200, true, 'Student retrieved successfully', student);
});

// @route   PUT /api/students/:id
const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  if (!student) return sendResponse(res, 404, false, 'Student not found');
  return sendResponse(res, 200, true, 'Student updated successfully', student);
});

// @route   DELETE /api/students/:id (soft delete)
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await studentService.softDeleteStudent(req.params.id);
  if (!student) return sendResponse(res, 404, false, 'Student not found');
  return sendResponse(res, 200, true, 'Student deleted successfully');
});

// @route   GET /api/students/:id/grades
const getStudentGrades = asyncHandler(async (req, res) => {
  const grades = await studentService.getStudentGrades(req.params.id);
  return sendResponse(res, 200, true, "Student's grade history retrieved", grades);
});

// @route   GET /api/students/:id/attendance
const getStudentAttendance = asyncHandler(async (req, res) => {
  const attendance = await studentService.getStudentAttendance(req.params.id);
  return sendResponse(res, 200, true, "Student's attendance records retrieved", attendance);
});

// @route   GET /api/students/:id/fees
const getStudentFees = asyncHandler(async (req, res) => {
  const fees = await studentService.getStudentFees(req.params.id);
  return sendResponse(res, 200, true, "Student's fee history retrieved", fees);
});

module.exports = {
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentGrades,
  getStudentAttendance,
  getStudentFees,
};
