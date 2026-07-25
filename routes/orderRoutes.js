const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { logAction } = require('../services/auditService');

// Place an order
router.post('/', protect, async (req, res) => {
  const { items } = req.body; // array of { productId, quantity }
  if (!items || items.length === 0) return res.status(400).json({ message: 'No items' });
  
  try {
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          priceAtPurchase: product.price
        });
      }
    }
    
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      status: 'pending'
    });
    const createdOrder = await order.save();
    
    await logAction(req.user._id, 'PLACE_ORDER', 'ORDER', createdOrder._id, { items: orderItems });
    
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: get all orders
router.get('/all', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
