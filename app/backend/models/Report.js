const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  animalType: String,
  animal: { type: String, required: true },
  condition: { type: String, required: true },
  location: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  address: String,
  description: String,
  phone: String,
  photo: String,
  photoUrl: String,
  // Geolocation of the reporter
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  // Status tracking: pending → acknowledged → in_progress → resolved
  status: { type: String, default: 'pending', enum: ['pending', 'acknowledged', 'in_progress', 'resolved'] },
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  // Who reported it (optional)
  reporterName: String,
  reporterEmail: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Report || mongoose.model("Report", reportSchema);
