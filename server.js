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

// Auto Seed Products helper
async function seedDefaultProducts() {
  try {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding initial products into database...');
      await Product.insertMany([
        {
          name: 'MEGA CHULLY: VOLT EDITION',
          description: 'Ultra-detailed Soft Vinyl collectible toy figurine with matte-glow finish and sensory seal.',
          price: 249,
          originalPrice: 320,
          stock: 45,
          images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAJh_yQh6XtitiIYFdjxVDM0G0ScXHxNF1Ty6zh6LhGCvXY9DzdXVHDrjlS2DAs0TaeBOJs9CSqqgTxZirlG1CKO_xF14sOx1GS9H3OfIhhswogQM5x8ta65MQV3i1BBSwRBmDZDxhK_bqxjNpCHDwDpaz7W-aarUrc20S9sfdmRDBaphw_8zUtnPioZTkrVCe5IMJvcTndpivLCw_SMfQ2DWVdcimTBrKj_jRQjcVE1Zmi6hyijLTLxOKhJPdeoH3cG-el01ilRUvr'],
          rarity: 'HYPER RARE',
          category: 'Vinyl Toys',
          inStock: true,
          isFeatured: true
        },
        {
          name: 'CYBER-DRAKE #9901',
          description: 'High-end glowing mechanical dragon with iridescent scales and holographic aura.',
          price: 189,
          originalPrice: 215,
          stock: 12,
          images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB0AzdQM2rk6uJFXfkKgZ1iB2KrgmVzKZe2xf2T9-yEc6bSF_mxe-WjvAh4hYHAtH4bNoVZgek4aJ1gMUFOnJ68wdgVf--e6cJckbmjqTBv5-NAySIhbeNst1qfxFEuParWItWReQHIpTz-ENciYL4pekhqFpnLn8snl_yQX76HJRIHGZpZA2-cmRvj65-aMIm8jbujdQE_iLHP3BqMXg60j5fpkfKvHg_T5IEKJhlIV7Qo3jQUe738yKiyiX_LODlreaS8ui7VcQ5w'],
          rarity: 'LEGENDARY',
          category: 'Digital Art',
          inStock: true,
          isFeatured: true
        },
        {
          name: 'HYPER-STOMPERS NEON',
          description: 'Design 3D sneaker with glowing LED panels, translucent soles, and Y2K aesthetic.',
          price: 145,
          originalPrice: 175,
          stock: 28,
          images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCouHmQra-rYKy7vmvoSznuArUDkI6SPCWjdwcvKBa7ZCZ503zS__wY7UZRLZGeXLnnmMaMb6pmLfyw9qirn3rLIkXJzFvU117KbU6b8TEfwUi7XKYbaR-jujwxu-bbIXtlPni6Umbaj4LLsJcEhy9Hg6ZQeMn_XnbJvYv_xT9wFRSG_AylUQZ6cYqhadnlCndeRJhzL9ja3xidVkxs6tiEWEJhTcKUNyNMJeWcaGkn2jPgtnO3QEtfgMsGeAlaU-Nh2fH33i_KJLgV'],
          rarity: 'RARE',
          category: 'Footwear',
          inStock: true,
          isFeatured: false
        },
        {
          name: 'ONI-MODULE 03 MASK',
          description: 'Samurai cyber armor mask with carbon fiber textures and intense pink glowing visor.',
          price: 99,
          originalPrice: 130,
          stock: 5,
          images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDOKtrtqTCweyfivkV2Vi2YnqHhbt68V6FQ_8fY7wBIlpb7VenKsIrRDBk7StEb18E0TBHfLS7ckHaW2CmeGrNCV8WagbzGN3Y58O6NCLj1kNOh27veikBfzUlmEgQLvS7oSE3Vkp4pAoHkl4YxDFPZtgTs1zPtOVw8ccWRMvQ96MhCT7AXlxz0ai1GU64usgP65u6LF6Pl2UHa54NLa9gzZXK5jSw8DsV6Jb0BRXSqxEsN2bJPronXH1VzdsZpoUFApdVoEEkKIwiH'],
          rarity: 'EPIC',
          category: 'Apparel',
          inStock: true,
          isFeatured: false
        }
      ]);
      console.log('Successfully seeded default Dopamine Vault products.');
    }
  } catch (err) {
    console.error('Error seeding products:', err.message);
  }
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    await seedDefaultProducts();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
