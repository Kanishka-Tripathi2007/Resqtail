const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: String,
  city: String,
  rescues: Number,
  badge: String
});

module.exports = mongoose.model("Volunteer", volunteerSchema);