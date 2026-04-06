const mongoose = require('mongoose');

const REPORT_REASON_CODES = [
  'fraud',
  'spam',
  'wrong_category',
  'prohibited_item',
  'duplicate',
  'sold_already',
  'other'
];

const REPORT_STATUSES = ['pending', 'reviewed', 'dismissed'];

const productReportSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reasonCode: { type: String, enum: REPORT_REASON_CODES, default: 'other' },
  reasonText: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: REPORT_STATUSES, default: 'pending' },
  productSnapshot: {
    title: { type: String, trim: true, default: '' },
    price: { type: Number, default: 0 }
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  adminNote: { type: String, trim: true, default: '', maxlength: 500 }
}, { timestamps: true });

productReportSchema.index({ product: 1, status: 1, createdAt: -1 });
productReportSchema.index({ reporter: 1, createdAt: -1 });
productReportSchema.index(
  { product: 1, reporter: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'pending' }
  }
);

module.exports = mongoose.model('ProductReport', productReportSchema);
