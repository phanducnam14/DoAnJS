const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productSnapshot: {
    title: { type: String, required: true },
    price: { type: Number, default: null },
    imageUrl: { type: String, default: '' },
    status: { type: String, enum: ['dang_ban', 'da_ban', 'da_an'], default: 'dang_ban' }
  },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  participantKey: { type: String, required: true },
  participantViews: {
    type: Map,
    of: Date,
    default: {}
  }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ product: 1, participantKey: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);

