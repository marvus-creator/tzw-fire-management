const express = require('express');
const router = express.Router();
const {
  logMaintenance, getAllMaintenance, getMaintenanceById,
} = require('../controllers/maintenanceController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Logging maintenance activities performed on extinguishers
 */

/**
 * @swagger
 * /api/maintenance:
 *   get:
 *     summary: Get all maintenance logs
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all maintenance logs
 *   post:
 *     summary: Log a maintenance activity (Inspectors only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [extinguisher, actionTaken, dateOfAction, conditionsNoted]
 *             properties:
 *               extinguisher:
 *                 type: string
 *                 description: Extinguisher ID
 *               actionTaken:
 *                 type: string
 *                 example: Refilled CO2 and replaced pressure gauge
 *               dateOfAction:
 *                 type: string
 *                 format: date
 *               conditionsNoted:
 *                 type: string
 *                 example: Minor corrosion on the base, monitor next visit
 *     responses:
 *       201:
 * 
 *         description: Maintenance log created successfully
 */
router.get('/', protect, getAllMaintenance);
router.post('/', protect, restrictTo('admin', 'inspector'), logMaintenance);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   get:
 *     summary: Get a maintenance log by ID
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Maintenance log details
 *       404:
 *         description: Maintenance log not found
 */
router.get('/:id', protect, getMaintenanceById);

module.exports = router;