const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  rarity: { type: String, default: 'STANDARD' },
  category: { type: String, default: 'Apparel' },
  sizes: [{ type: String }],
  inStock: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Made optional for seeder
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
