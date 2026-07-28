const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true } // snapshot of price
  }],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  trackingNumber: { type: String, default: '' },
  carrier: { type: String, default: 'DOPAMINE_EXPRESS_LOGISTICS' },
  dispatchNotes: { type: String, default: '' },
  statusLogs: [{
    status: { type: String },
    note: { type: String },
    updatedBy: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
