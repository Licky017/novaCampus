/**
 * @file controllers/feeController.js
 * @description Thin HTTP layer for fee endpoints, delegating business logic
 * to services/feeService.js.
 * @dependencies ../services/feeService, ../utils/asyncHandler, ../utils/sendResponse
 */

const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const feeService = require('../services/feeService');

// @route   GET /api/fees
const getFees = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, studentId } = req.query;
  const { fees, pagination } = await feeService.listFees({ page, limit, status, studentId });
  return sendResponse(res, 200, true, 'Fee records retrieved successfully', fees, pagination);
});

// @route   POST /api/fees
const createFee = asyncHandler(async (req, res) => {
  const fee = await feeService.createFee(req.body);
  return sendResponse(res, 201, true, 'Fee record created successfully', fee);
});

// @route   PUT /api/fees/:id
const updateFee = asyncHandler(async (req, res) => {
  const fee = await feeService.updateFee(req.params.id, req.body);
  if (!fee) return sendResponse(res, 404, false, 'Fee record not found');
  return sendResponse(res, 200, true, 'Fee record updated successfully', fee);
});

// @route   DELETE /api/fees/:id
const deleteFee = asyncHandler(async (req, res) => {
  const fee = await feeService.deleteFee(req.params.id);
  if (!fee) return sendResponse(res, 404, false, 'Fee record not found');
  return sendResponse(res, 200, true, 'Fee record deleted successfully');
});

// @route   GET /api/fees/overdue
const getOverdueFees = asyncHandler(async (req, res) => {
  const fees = await feeService.getOverdueFees();
  return sendResponse(res, 200, true, 'Overdue fee records retrieved successfully', fees);
});

// @route   GET /api/fees/student/:id
const getStudentFeeSummary = asyncHandler(async (req, res) => {
  const summary = await feeService.getStudentFeeSummary(req.params.id);
  return sendResponse(res, 200, true, 'Student fee summary retrieved successfully', summary);
});

// @route   GET /api/fees/stats
const getFeeStats = asyncHandler(async (req, res) => {
  const stats = await feeService.getFeeStats();
  return sendResponse(res, 200, true, 'Fee revenue statistics retrieved successfully', stats);
});

module.exports = { getFees, createFee, updateFee, deleteFee, getOverdueFees, getStudentFeeSummary, getFeeStats };
