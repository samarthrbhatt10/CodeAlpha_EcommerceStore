const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // for showing discounts
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  rarity: { type: String, default: 'STANDARD' },
  category: { type: String, default: 'Apparel' },
  sizes: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
