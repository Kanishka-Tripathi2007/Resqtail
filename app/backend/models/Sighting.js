const mongoose = require("mongoose");

const sightingSchema = new mongoose.Schema({
  status: String,
  animal: String,
  description: String,
  location: String,
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Sighting", sightingSchema);