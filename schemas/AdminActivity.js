const mongoose = require('mongoose');

const adminActivitySchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, trim: true },
  targetType: { type: String, enum: ['user', 'product', 'dashboard'], required: true },
  targetId: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

adminActivitySchema.index({ createdAt: -1 });
adminActivitySchema.index({ admin: 1, createdAt: -1 });

module.exports = mongoose.model('AdminActivity', adminActivitySchema);
