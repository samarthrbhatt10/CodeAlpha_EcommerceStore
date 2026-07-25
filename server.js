const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

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

// Fallback to serve index for known html routes for convenience
app.get('/', sendHtml('home.html'));
app.get('/auth', sendHtml('auth.html'));
app.get('/catalog', sendHtml('catalog.html'));
app.get('/cart', sendHtml('cart.html'));
app.get('/admin', sendHtml('admin.html'));
app.get('/pdp', sendHtml('pdp.html'));
app.get('/profile', sendHtml('profile.html'));
app.get('/settings', sendHtml('settings.html'));

// Routes placeholders
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
