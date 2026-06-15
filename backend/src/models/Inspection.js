const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema(
  {
    extinguisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Extinguisher', required: true },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scheduledDate: { type: Date, required: [true, 'Scheduled date is required'] },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inspection', inspectionSchema);