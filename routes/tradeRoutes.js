const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /api/trades/market - Get open trades
router.get('/market', async (req, res) => {
  try {
    const trades = await Trade.find({ status: 'pending' })
      .populate('initiatorId', 'name')
      .populate('offeredItems')
      .populate('requestedItems')
      .sort('-createdAt');
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/trades/offer - Create a new trade offer
router.post('/offer', protect, async (req, res) => {
  try {
    const { offeredItems, requestedItems } = req.body;
    // Verify user owns offered items (simplification: checking if items exist in user inventory)
    const user = await User.findById(req.user._id);
    const hasItems = offeredItems.every(id => user.inventory.includes(id));
    if (!hasItems) {
      return res.status(400).json({ message: 'You do not own all offered items' });
    }

    const trade = new Trade({
      initiatorId: req.user._id,
      offeredItems,
      requestedItems
    });
    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/trades/accept/:id - Accept a trade offer
router.post('/accept/:id', protect, async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade || trade.status !== 'pending') {
      return res.status(404).json({ message: 'Trade not found or not active' });
    }

    if (trade.initiatorId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot accept your own trade' });
    }

    const acceptor = await User.findById(req.user._id);
    const initiator = await User.findById(trade.initiatorId);

    // Verify acceptor has the requested items
    const hasRequested = trade.requestedItems.every(id => acceptor.inventory.includes(id));
    if (!hasRequested) {
      return res.status(400).json({ message: 'You do not have the required items to accept this trade' });
    }

    // Swap items
    // 1. Remove offered items from initiator, add to acceptor
    trade.offeredItems.forEach(id => {
      initiator.inventory = initiator.inventory.filter(invId => invId.toString() !== id.toString());
      acceptor.inventory.push(id);
    });

    // 2. Remove requested items from acceptor, add to initiator
    trade.requestedItems.forEach(id => {
      acceptor.inventory = acceptor.inventory.filter(invId => invId.toString() !== id.toString());
      initiator.inventory.push(id);
    });

    trade.status = 'accepted';
    trade.targetId = req.user._id;

    await initiator.save();
    await acceptor.save();
    await trade.save();

    res.json({ message: 'Trade accepted successfully', trade });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
