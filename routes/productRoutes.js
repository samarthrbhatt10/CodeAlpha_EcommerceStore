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

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      originalPrice, 
      stock, 
      images, 
      rarity, 
      category, 
      sizes, 
      tags, 
      isFeatured 
    } = req.body;

    const product = new Product({
      name,
      description: description || `Limited edition ${name || 'collectible'} from Dopamine Vault.`,
      price: Number(price) || 0,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock) || 0,
      images: Array.isArray(images) ? images : (images ? [images] : ['https://lh3.googleusercontent.com/aida-public/AB6AXuAJh_yQh6XtitiIYFdjxVDM0G0ScXHxNF1Ty6zh6LhGCvXY9DzdXVHDrjlS2DAs0TaeBOJs9CSqqgTxZirlG1CKO_xF14sOx1GS9H3OfIhhswogQM5x8ta65MQV3i1BBSwRBmDZDxhK_bqxjNpCHDwDpaz7W-aarUrc20S9sfdmRDBaphw_8zUtnPioZTkrVCe5IMJvcTndpivLCw_SMfQ2DWVdcimTBrKj_jRQjcVE1Zmi6hyijLTLxOKhJPdeoH3cG-el01ilRUvr']),
      rarity: rarity || 'STANDARD',
      category: category || 'Collectibles',
      sizes: sizes || ['STD'],
      tags: tags || ['NEW_DROP'],
      isFeatured: Boolean(isFeatured),
      inStock: (Number(stock) || 0) > 0,
      createdBy: req.user._id
    });

    const createdProduct = await product.save();
    await logAction(req.user._id, 'CREATE_PRODUCT', 'PRODUCT', createdProduct._id, { name, price, stock, category });
    
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['name', 'description', 'price', 'originalPrice', 'stock', 'images', 'rarity', 'category', 'sizes', 'tags', 'isFeatured'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    if (req.body.stock !== undefined) {
      product.inStock = Number(req.body.stock) > 0;
    }

    const updatedProduct = await product.save();
    await logAction(req.user._id, 'UPDATE_PRODUCT', 'PRODUCT', updatedProduct._id, req.body);

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await logAction(req.user._id, 'DELETE_PRODUCT', 'PRODUCT', req.params.id, { name: product.name });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
