/**
 * @file controllers/subjectController.js
 * @description Thin HTTP layer for direct subject CRUD endpoints,
 * delegating business logic to services/subjectService.js.
 * @dependencies ../services/subjectService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const subjectService = require('../services/subjectService');

// @route   GET /api/subjects
const getSubjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', classId } = req.query;
  const { subjects, pagination } = await subjectService.listSubjects({ page, limit, search, classId });
  return sendResponse(res, 200, true, 'Subjects retrieved successfully', subjects, pagination);
});

// @route   POST /api/subjects
const createSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.createSubject(req.body);
  return sendResponse(res, 201, true, 'Subject created successfully', subject);
});

// @route   GET /api/subjects/:id
const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.id);
  if (!subject) return sendResponse(res, 404, false, 'Subject not found');
  return sendResponse(res, 200, true, 'Subject retrieved successfully', subject);
});

// @route   PUT /api/subjects/:id
const updateSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.updateSubject(req.params.id, req.body);
  if (!subject) return sendResponse(res, 404, false, 'Subject not found');
  return sendResponse(res, 200, true, 'Subject updated successfully', subject);
});

// @route   DELETE /api/subjects/:id
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.deleteSubject(req.params.id);
  if (!subject) return sendResponse(res, 404, false, 'Subject not found');
  return sendResponse(res, 200, true, 'Subject deleted successfully');
});

module.exports = { getSubjects, createSubject, getSubjectById, updateSubject, deleteSubject };
