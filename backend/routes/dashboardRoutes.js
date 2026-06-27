/**
 * @file routes/dashboardRoutes.js
 * @description Defines /api/dashboard/* endpoints providing aggregated stats,
 * chart data, and a recent-activity feed for the role-based dashboards.
 * @dependencies express, ../controllers/dashboardController, ../middleware/authMiddleware
 */

const express = require('express');
const router = express.Router();

const { getStats, getCharts, getActivity } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getStats);
router.get('/charts', getCharts);
router.get('/activity', getActivity);

module.exports = router;
