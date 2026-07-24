const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { logAction } = require('../services/auditService');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = new Product({ name, price, stock, createdBy: req.user._id });
    const createdProduct = await product.save();
    
    await logAction(req.user._id, 'CREATE_PRODUCT', 'PRODUCT', createdProduct._id, { name, price, stock });
    
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
