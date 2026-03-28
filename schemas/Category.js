const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  icon: String,
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

