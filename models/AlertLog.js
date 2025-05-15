const mongoose = require('mongoose');

const AlertLogSchema = new mongoose.Schema({
  forest: String,
  animalId: String,
  lat: Number,
  lng: Number,
  riskScore: Number,
  timestamp: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AlertLog', AlertLogSchema);
