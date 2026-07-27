const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/drops/active - Get the current active live drop status
router.get('/active', async (req, res) => {
  try {
    // In a real app, this might query a 'Drop' model.
    // For now, we simulate a drop that ends in 1 hour from the request time.
    const endTime = new Date(Date.now() + 60 * 60 * 1000); 
    
    // Fetch some featured products for the drop
    const dropItems = await Product.find({ isFeatured: true }).limit(3);

    res.json({
      dropId: 'SYS_OVERLOAD_042',
      status: 'active',
      endTime: endTime.toISOString(),
      items: dropItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
