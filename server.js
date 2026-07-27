const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected to Squad Chat');
  
  socket.on('chat_message', async (data) => {
    try {
      const Message = require('./models/Message');
      const User = require('./models/User');
      
      const msg = new Message({ sender: data.senderId, text: data.text });
      await msg.save();
      
      const populatedMsg = await Message.findById(msg._id).populate('sender', 'name role');
      io.emit('chat_message', populatedMsg);
    } catch (err) {
      console.error('Chat error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

const sendHtml = (file) => (req, res) => {
  res.sendFile(file, { root: path.join(__dirname, 'public') }, (err) => {
    if (err) {
      console.error(`Error sending ${file}:`, err);
      res.status(err.status || 500).send(`Error loading page: ${file}`);
    }
  });
};

// Page routes
app.get('/', sendHtml('home.html'));
app.get('/auth', sendHtml('auth.html'));
app.get('/catalog', sendHtml('catalog.html'));
app.get('/cart', sendHtml('cart.html'));
app.get('/admin', sendHtml('admin.html'));
app.get('/pdp', sendHtml('pdp.html'));
app.get('/profile', sendHtml('profile.html'));
app.get('/settings', sendHtml('settings.html'));
app.get('/unboxing', sendHtml('unboxing.html'));
app.get('/drop', sendHtml('drop.html'));
app.get('/trade', sendHtml('trade.html'));
app.get('/chat', sendHtml('chat.html'));
app.get('/recruitment', sendHtml('recruitment.html'));
app.get('/success', sendHtml('success.html'));
app.get('/failure', sendHtml('failure.html'));
app.get('/admin_dashboard', sendHtml('admin_dashboard.html'));
app.get('/admin_orders', sendHtml('admin_orders.html'));
app.get('/admin_inventory', sendHtml('admin_inventory.html'));
app.get('/admin_analytics', sendHtml('admin_analytics.html'));

// Favicon — serve SVG with correct content-type
app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/svg+xml');
  res.sendFile('favicon.svg', { root: path.join(__dirname, 'public') });
});
app.get('/favicon.svg', (req, res) => {
  res.set('Content-Type', 'image/svg+xml');
  res.sendFile('favicon.svg', { root: path.join(__dirname, 'public') });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/vault', require('./routes/vaultRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));
app.use('/api/drops', require('./routes/dropRoutes'));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
