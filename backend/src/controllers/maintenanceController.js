const Maintenance = require('../models/Maintenance');

// LOG MAINTENANCE
exports.logMaintenance = async (req, res) => {
  try {
    const { extinguisher, actionTaken, dateOfAction, conditionsNoted } = req.body;
    const maintenance = await Maintenance.create({
      extinguisher,
      inspector: req.user.id,
      actionTaken,
      dateOfAction,
      conditionsNoted,
    });
    await maintenance.populate(['extinguisher', 'inspector']);
    res.status(201).json({ success: true, maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL MAINTENANCE LOGS
exports.getAllMaintenance = async (req, res) => {
  try {
    const logs = await Maintenance.find()
      .populate('extinguisher', 'serialNumber location type')
      .populate('inspector', 'firstName lastName email');
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ONE MAINTENANCE LOG
exports.getMaintenanceById = async (req, res) => {
  try {
    const log = await Maintenance.findById(req.params.id)
      .populate('extinguisher')
      .populate('inspector', 'firstName lastName email');
    if (!log) {
      return res.status(404).json({ success: false, message: 'Maintenance log not found.' });
    }
    res.status(200).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};