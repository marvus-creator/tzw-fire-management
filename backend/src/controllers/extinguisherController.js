const Extinguisher = require('../models/Extinguisher');

// CREATE
exports.createExtinguisher = async (req, res) => {
  try {
    const extinguisher = await Extinguisher.create(req.body);
    res.status(201).json({ success: true, extinguisher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL
exports.getAllExtinguishers = async (req, res) => {
  try {
    const extinguishers = await Extinguisher.find();
    res.status(200).json({ success: true, count: extinguishers.length, extinguishers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ONE BY ID
exports.getExtinguisherById = async (req, res) => {
  try {
    const extinguisher = await Extinguisher.findById(req.params.id);
    if (!extinguisher) {
      return res.status(404).json({ success: false, message: 'Extinguisher not found.' });
    }
    res.status(200).json({ success: true, extinguisher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateExtinguisher = async (req, res) => {
  try {
    const extinguisher = await Extinguisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!extinguisher) {
      return res.status(404).json({ success: false, message: 'Extinguisher not found.' });
    }
    res.status(200).json({ success: true, extinguisher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteExtinguisher = async (req, res) => {
  try {
    const extinguisher = await Extinguisher.findByIdAndDelete(req.params.id);
    if (!extinguisher) {
      return res.status(404).json({ success: false, message: 'Extinguisher not found.' });
    }
    res.status(200).json({ success: true, message: 'Extinguisher deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};