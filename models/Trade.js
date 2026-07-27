const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  initiatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null if it's an open market offer
  offeredItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  requestedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
