const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    extinguisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Extinguisher', required: true },
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actionTaken: { type: String, required: [true, 'Action taken is required'], trim: true },
    dateOfAction: { type: Date, required: [true, 'Date of action is required'] },
    conditionsNoted: { type: String, required: [true, 'Conditions noted is required'], trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);