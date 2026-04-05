const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  condition: { type: String, enum: ['new', 'like_new', 'good', 'used'], required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  isHidden: { type: Boolean, default: false },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isSold: { type: Boolean, default: false },
  isBoosted: { type: Boolean, default: false },
  boostedUntil: Date,
  views: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ category: 1, location: 1, createdAt: -1 });
productSchema.index({ isBoosted: 1, boostedUntil: 1 });
productSchema.index({ status: 1, isHidden: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);

