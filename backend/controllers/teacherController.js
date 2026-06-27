/**
 * @file controllers/teacherController.js
 * @description Thin HTTP layer for teacher endpoints, delegating business
 * logic to services/teacherService.js.
 * @dependencies ../services/teacherService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const teacherService = require('../services/teacherService');

// @route   GET /api/teachers
const getTeachers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', department } = req.query;
  const { teachers, pagination } = await teacherService.listTeachers({ page, limit, search, department });
  return sendResponse(res, 200, true, 'Teachers retrieved successfully', teachers, pagination);
});

// @route   POST /api/teachers
const createTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);
  return sendResponse(res, 201, true, 'Teacher created successfully', teacher);
});

// @route   GET /api/teachers/:id
const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id);
  if (!teacher) return sendResponse(res, 404, false, 'Teacher not found');
  return sendResponse(res, 200, true, 'Teacher retrieved successfully', teacher);
});

// @route   PUT /api/teachers/:id
const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.updateTeacher(req.params.id, req.body);
  if (!teacher) return sendResponse(res, 404, false, 'Teacher not found');
  return sendResponse(res, 200, true, 'Teacher updated successfully', teacher);
});

// @route   DELETE /api/teachers/:id (soft delete)
const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.softDeleteTeacher(req.params.id);
  if (!teacher) return sendResponse(res, 404, false, 'Teacher not found');
  return sendResponse(res, 200, true, 'Teacher deleted successfully');
});

// @route   GET /api/teachers/:id/classes
const getTeacherClasses = asyncHandler(async (req, res) => {
  const classes = await teacherService.getTeacherClasses(req.params.id);
  return sendResponse(res, 200, true, "Teacher's assigned classes retrieved", classes);
});

module.exports = {
  getTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherClasses,
};
