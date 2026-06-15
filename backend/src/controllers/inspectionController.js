const Inspection = require('../models/Inspection');
const User = require('../models/User');
const Extinguisher = require('../models/Extinguisher');
const sendEmail = require('../utils/sendEmail');

// SCHEDULE INSPECTION
exports.scheduleInspection = async (req, res) => {
  try {
    const { extinguisher, scheduledDate, inspector, notes } = req.body;

    // Find inspector user to notify
    const inspectorUser = await User.findById(inspector);
    if (!inspectorUser || inspectorUser.role !== 'inspector') {
      return res.status(400).json({ success: false, message: 'Invalid inspector selected.' });
    }

    const inspection = await Inspection.create({
      extinguisher,
      scheduledBy: req.user.id,
      inspector,
      scheduledDate,
      notes,
    });

    await inspection.populate(['extinguisher', 'inspector', 'scheduledBy']);

    // Notify the assigned inspector by email.
    const ext = await Extinguisher.findById(extinguisher);
    const when = new Date(scheduledDate).toLocaleString();
    let notified = false;
    try {
      const result = await sendEmail({
        to: inspectorUser.email,
        subject: 'TZW Fire Management - New Inspection Assigned',
        text:
          `Hi ${inspectorUser.firstName},\n\n` +
          `You have been assigned a new extinguisher inspection.\n\n` +
          `Extinguisher: ${ext ? `${ext.serialNumber} (${ext.location})` : extinguisher}\n` +
          `Scheduled for: ${when}\n` +
          (notes ? `Notes: ${notes}\n` : '') +
          `\nPlease log in to the TZW Fire Management system for details.`,
      });
      notified = result.delivered;
    } catch (mailErr) {
      // Inspection is already saved; notification failure shouldn't fail the request.
      console.error('Inspection notification email failed:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: `Inspection scheduled. ${inspectorUser.firstName} ${inspectorUser.lastName} ` +
        `${notified ? 'has been notified by email.' : 'will be notified (email pending / not configured).'}`,
      inspection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL INSPECTIONS
exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find()
      .populate('extinguisher', 'serialNumber location type')
      .populate('inspector', 'firstName lastName email')
      .populate('scheduledBy', 'firstName lastName');
    res.status(200).json({ success: true, count: inspections.length, inspections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ONE INSPECTION
exports.getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('extinguisher')
      .populate('inspector', 'firstName lastName email')
      .populate('scheduledBy', 'firstName lastName');
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found.' });
    }
    res.status(200).json({ success: true, inspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE INSPECTION
exports.updateInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found.' });
    }
    res.status(200).json({ success: true, inspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};