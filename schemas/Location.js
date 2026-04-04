const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  province: { type: String, required: true },
  district: String,
  ward: String
}, { timestamps: true });

locationSchema.index({ province: 1, district: 1 });

module.exports = mongoose.model('Location', locationSchema);

