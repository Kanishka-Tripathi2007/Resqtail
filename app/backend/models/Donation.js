const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  ngo: { type: String },
  amount: { type: Number }, // in INR
  message: { type: String }, // donor message
  orderId: { type: String },
  paymentId: { type: String },
  signature: { type: String },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
