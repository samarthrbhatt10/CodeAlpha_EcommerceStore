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
  if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });
  
  try {
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const qty = Number(item.quantity) || 1;
        const itemTotal = product.price * qty;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product._id,
          quantity: qty,
          priceAtPurchase: product.price
        });

        // Deduct stock
        product.stock = Math.max(0, product.stock - qty);
        product.inStock = product.stock > 0;
        await product.save();
      }
    }

    const orderNum = `DOP-${Math.floor(1000 + Math.random() * 9000)}-X`;
    const trackingNum = `TRK-DOP-${Date.now().toString().slice(-6)}`;

    const order = new Order({
      userId: req.user._id,
      orderNumber: orderNum,
      items: orderItems,
      totalAmount,
      status: 'pending',
      trackingNumber: trackingNum,
      carrier: 'DOPAMINE_EXPRESS_LOGISTICS',
      statusLogs: [{
        status: 'pending',
        note: 'Order placed & payment verified.',
        updatedBy: req.user.name || 'Customer'
      }]
    });

    const createdOrder = await order.save();
    
    // Update user stats
    req.user.totalOrders = (req.user.totalOrders || 0) + 1;
    req.user.dpBalance = Math.max(0, (req.user.dpBalance || 1000) + Math.floor(totalAmount * 0.1));
    await req.user.save();

    await logAction(req.user._id, 'PLACE_ORDER', 'ORDER', createdOrder._id, { orderNumber: orderNum, totalAmount });
    
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name price images rarity category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: get all orders
router.get('/all', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email role')
      .populate('items.productId', 'name price images rarity')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order / shipment status (Dispatcher)
router.patch('/:id/status', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, dispatchNotes, carrier } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (dispatchNotes) order.dispatchNotes = dispatchNotes;
    if (carrier) order.carrier = carrier;

    order.statusLogs.push({
      status: status || order.status,
      note: dispatchNotes || `Status updated to ${status || order.status}`,
      updatedBy: req.user.name || 'Admin Dispatcher'
    });

    const updatedOrder = await order.save();
    await logAction(req.user._id, 'UPDATE_ORDER_STATUS', 'ORDER', order._id, { status: order.status });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
