const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String }, // e.g., Dog, Cat
  breed: { type: String },
  age: { type: String },
  sex: { type: String },
  shelter: { type: String },
  description: { type: String },
  photos: [String],
  contact: { type: String },
  // Extended fields
  vaccination: { type: String, default: 'Unknown' }, // Vaccinated / Not Vaccinated / Unknown
  location: { type: String },
  listerType: { type: String, default: 'Individual' }, // Individual / Shelter / Pet Shop
  status: { type: String, default: 'available', enum: ['available', 'adopted', 'pending'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
