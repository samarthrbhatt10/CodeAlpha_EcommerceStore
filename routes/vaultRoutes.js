const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// POST /api/vault/open - Opens a mystery box
router.post('/open', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if user has enough DP (assuming a box costs 500 DP)
    const BOX_COST = 500;
    if (user.dpBalance < BOX_COST) {
      return res.status(400).json({ message: 'Insufficient Dopamine Points' });
    }

    // Deduct DP
    user.dpBalance -= BOX_COST;

    // Fetch all available products
    const products = await Product.find({ inStock: true });
    if (products.length === 0) {
      return res.status(400).json({ message: 'No items available in the vault' });
    }

    // Simple weighted random selection
    // Rarity weights: STANDARD: 70%, RARE: 25%, MYTHIC: 5%
    const rand = Math.random();
    let selectedRarity = 'STANDARD';
    if (rand > 0.95) selectedRarity = 'MYTHIC';
    else if (rand > 0.70) selectedRarity = 'RARE';

    // Filter products by selected rarity, fallback to any if none found
    let pool = products.filter(p => p.rarity === selectedRarity);
    if (pool.length === 0) pool = products;

    // Pick random item from pool
    const selectedItem = pool[Math.floor(Math.random() * pool.length)];

    // Add to inventory
    user.inventory.push(selectedItem._id);
    await user.save();

    res.json({
      message: 'Box opened successfully',
      item: selectedItem,
      newBalance: user.dpBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/vault/inventory - Gets user's inventory
router.get('/inventory', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('inventory');
    res.json(user.inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
