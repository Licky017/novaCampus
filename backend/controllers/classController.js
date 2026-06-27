/**
 * @file controllers/classController.js
 * @description Thin HTTP layer for class endpoints, delegating business
 * logic to services/classService.js.
 * @dependencies ../services/classService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const classService = require('../services/classService');

// @route   GET /api/classes
const getClasses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', grade } = req.query;
  const { classes, pagination } = await classService.listClasses({ page, limit, search, grade });
  return sendResponse(res, 200, true, 'Classes retrieved successfully', classes, pagination);
});

// @route   POST /api/classes
const createClass = asyncHandler(async (req, res) => {
  const newClass = await classService.createClass(req.body);
  return sendResponse(res, 201, true, 'Class created successfully', newClass);
});

// @route   GET /api/classes/:id
const getClassById = asyncHandler(async (req, res) => {
  const cls = await classService.getClassById(req.params.id);
  if (!cls) return sendResponse(res, 404, false, 'Class not found');
  return sendResponse(res, 200, true, 'Class retrieved successfully', cls);
});

// @route   PUT /api/classes/:id
const updateClass = asyncHandler(async (req, res) => {
  const cls = await classService.updateClass(req.params.id, req.body);
  if (!cls) return sendResponse(res, 404, false, 'Class not found');
  return sendResponse(res, 200, true, 'Class updated successfully', cls);
});

// @route   DELETE /api/classes/:id
const deleteClass = asyncHandler(async (req, res) => {
  const cls = await classService.deleteClass(req.params.id);
  if (!cls) return sendResponse(res, 404, false, 'Class not found');
  return sendResponse(res, 200, true, 'Class deleted successfully');
});

// @route   GET /api/classes/:id/students
const getClassStudents = asyncHandler(async (req, res) => {
  const students = await classService.getClassStudents(req.params.id);
  if (students === null) return sendResponse(res, 404, false, 'Class not found');
  return sendResponse(res, 200, true, 'Class roster retrieved successfully', students);
});

// @route   POST /api/classes/:id/subjects
const addSubjectToClass = asyncHandler(async (req, res) => {
  const subject = await classService.addSubjectToClass(req.params.id, req.body);
  return sendResponse(res, 201, true, 'Subject added to class successfully', subject);
});

module.exports = {
  getClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
  getClassStudents,
  addSubjectToClass,
};
