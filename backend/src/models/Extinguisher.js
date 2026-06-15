const mongoose = require('mongoose');

const extinguisherSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, required: [true, 'Serial number is required'], unique: true, trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    type: { type: String, required: true, enum: ['Water', 'CO2', 'Foam', 'Dry Chemical'] },
    size: { type: String, required: true, enum: ['2.5 lbs', '5 lbs', '9 lbs', '12 lbs'] },
    installationDate: { type: Date, required: [true, 'Installation date is required'] },
    expiryDate: { type: Date, required: [true, 'Expiry date is required'] },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Under Maintenance', 'Decommissioned'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Extinguisher', extinguisherSchema);