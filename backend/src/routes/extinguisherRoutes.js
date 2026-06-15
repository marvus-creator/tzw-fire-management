const express = require('express');
const router = express.Router();
const {
  createExtinguisher, getAllExtinguishers,
  getExtinguisherById, updateExtinguisher, deleteExtinguisher,
} = require('../controllers/extinguisherController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Extinguishers
 *   description: Fire extinguisher management
 */

/**
 * @swagger
 * /api/extinguishers:
 *   get:
 *     summary: Get all extinguishers
 *     tags: [Extinguishers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all extinguishers
 *   post:
 *     summary: Register a new extinguisher
 *     tags: [Extinguishers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serialNumber, location, type, size, installationDate, expiryDate]
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 example: FE-2024-001
 *               location:
 *                 type: string
 *                 example: Building A - Floor 2
 *               type:
 *                 type: string
 *                 enum: [Water, CO2, Foam, Dry Chemical]
 *                 example: CO2
 *               size:
 *                 type: string
 *                 enum: ['2.5 lbs', '5 lbs', '9 lbs', '12 lbs']
 *                 example: 5 lbs
 *               installationDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-15
 *               status:
 *                 type: string
 *                 enum: [Active, Expired, Under Maintenance, Decommissioned]
 *                 example: Active
 *     responses:
 *       201:
 *         description: Extinguisher created successfully
 */
router.get('/', protect, getAllExtinguishers);
router.post('/', protect, restrictTo('admin', 'inspector'), createExtinguisher);

/**
 * @swagger
 * /api/extinguishers/{id}:
 *   get:
 *     summary: Get an extinguisher by ID
 *     tags: [Extinguishers]
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
 *         description: Extinguisher details
 *       404:
 *         description: Extinguisher not found
 *   put:
 *     summary: Update an extinguisher by ID
 *     tags: [Extinguishers]
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
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Expired, Under Maintenance, Decommissioned]
 *     responses:
 *       200:
 *         description: Extinguisher updated successfully
 *       404:
 *         description: Extinguisher not found
 *   delete:
 *     summary: Delete an extinguisher by ID
 *     tags: [Extinguishers]
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
 *         description: Extinguisher deleted successfully
 *       404:
 *         description: Extinguisher not found
 */
router.get('/:id', protect, getExtinguisherById);
router.put('/:id', protect, restrictTo('admin', 'inspector'), updateExtinguisher);
router.delete('/:id', protect, restrictTo('admin'), deleteExtinguisher);

module.exports = router;