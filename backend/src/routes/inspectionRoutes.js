const express = require('express');
const router = express.Router();
const {
  scheduleInspection, getAllInspections,
  getInspectionById, updateInspection,
} = require('../controllers/inspectionController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Inspections
 *   description: Scheduling and managing extinguisher inspections
 */

/**
 * @swagger
 * /api/inspections:
 *   get:
 *     summary: Get all inspections
 *     tags: [Inspections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all inspections
 *   post:
 *     summary: Schedule a new inspection
 *     tags: [Inspections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [extinguisher, scheduledDate, inspector]
 *             properties:
 *               extinguisher:
 *                 type: string
 *                 description: Extinguisher ID
 *               inspector:
 *                 type: string
 *                 description: Inspector user ID (will be notified)
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inspection scheduled successfully, inspector notified
 *       400:
 *         description: Invalid inspector selected
 */
router.get('/', protect, getAllInspections);
router.post('/', protect, scheduleInspection);

/**
 * @swagger
 * /api/inspections/{id}:
 *   get:
 *     summary: Get an inspection by ID
 *     tags: [Inspections]
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
 *         description: Inspection details
 *       404:
 *         description: Inspection not found
 *   put:
 *     summary: Update an inspection (e.g. mark as completed)
 *     tags: [Inspections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Scheduled, Completed, Cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inspection updated successfully
 *       404:
 *         description: Inspection not found
 */
router.get('/:id', protect, getInspectionById);
router.put('/:id', protect, restrictTo('admin', 'inspector'), updateInspection);

module.exports = router;