const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Real-time reporting on extinguisher stock and inspections
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get real-time reports (Admin only)
 *     description: Returns total extinguisher counts (daily/monthly/yearly), status breakdown, and inspection status summary
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report data
 *       403:
 *         description: Access denied - admin only
 */
router.get('/', protect, restrictTo('admin'), getReports);

module.exports = router;