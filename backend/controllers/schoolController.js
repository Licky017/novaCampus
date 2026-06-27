/**
 * @file controllers/schoolController.js
 * @description Basic school profile CRUD.
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const School = require('../models/School');

const getSchools = asyncHandler(async (req, res) => {
  const schools = await School.find().sort({ createdAt: -1 });
  return sendResponse(res, 200, true, 'Schools retrieved successfully', schools);
});

const createSchool = asyncHandler(async (req, res) => {
  const school = await School.create(req.body);
  return sendResponse(res, 201, true, 'School created successfully', school);
});

const getSchoolById = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) return sendResponse(res, 404, false, 'School not found');
  return sendResponse(res, 200, true, 'School retrieved successfully', school);
});

const updateSchool = asyncHandler(async (req, res) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!school) return sendResponse(res, 404, false, 'School not found');
  return sendResponse(res, 200, true, 'School updated successfully', school);
});

module.exports = { getSchools, createSchool, getSchoolById, updateSchool };
