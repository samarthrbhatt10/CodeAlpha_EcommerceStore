require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const productsData = [
  {
    name: 'Cyber-Mecha V1',
    description: 'A high-octane 3D render of a neon-translucent designer vinyl toy character with cybernetic enhancements, set against a dark indigo background with electric lime laser beams. The aesthetic is neo-brutalist with high-contrast lighting and a polished gloss finish.',
    price: 189.00,
    stock: 50,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD2p9X0Uq3fM1USBQOcPQ_c94R5U2s5pmpddM1cubjDNfpl5gXuTJmCC1WX3T8LEAZfZa89OAM63VdX839AJpmjKm7NudvgsZ-ZR0MnGg-I1KZopoI_cmmwTKlcdnG9OEydU5iPlGDpw_z67w6rZf5B2D8yTqn28sDyznBWlJAOhI-rc7bhRJFiHGlNP9H7ddo-aQZbFA6vkHNiX0L_Pw46FZY1uMqtFOlPr5hCNwqBBd_yg9_N9OdHBVIqMrxt4DvQWpD4Ez4bfpBu'],
    rarity: 'LEGENDARY DROP',
    category: 'Toys',
    sizes: ['OS'],
    inStock: true
  },
  {
    name: 'Prism Hoodie',
    description: 'A vibrant holographic hoodie displayed floating in a digital void. The fabric has a shifting oil-slick texture with cyan and magenta iridescent reflections. The scene is illuminated by harsh neon pink top-down lighting, emphasizing the heavy neo-brutalist textile details.',
    price: 75.00,
    stock: 200,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB2_Mzb8c_sKa0CsouSmxbf0s0HigYdXSwE1f2MW_A-W0JQkfWxbe33Ts6S0tR8SWpbwmqzM9DCG3HqOlSU-nAgRCFiKhUQLkTOUqZy7CswRR3S4cduhAkNoRFpsCZoE7NjVTYWSZUv-UCrg3yVbTVI7yDowOKQumSPXk2B2_aSH5ePy7u9PledDL0P4x48cJQhRc7YwRt4lzT2U-OS-M5WHtWtab54CIWowSDm6oBrRCqxpJR_DdTPsJbeuzlloxn7yCmEgkq5BSvz'],
    rarity: 'VAULT ITEM',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    name: 'Neon Runners',
    description: 'Chunky sneakers with a retro-futuristic vibe, featuring glowing soles and reflective paneling. Designed for the urban explorer.',
    price: 150.00,
    stock: 75,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCUl5j48Z1H_Z57H1V8_I9l1H2k0K1jX8uV_L9m3bL_T_S6q9g6w_LqF_D7v-j9qY8gH2qF3_Q9yL9X4_qJ8g6v1lX_K1lV8yJ3qL1kX5jG2_F4qH9_Q7yT_Q1l3_F2yB9'],
    rarity: 'LIMITED EDITION',
    category: 'Footwear',
    sizes: ['8', '9', '10', '11', '12'],
    inStock: true
  },
  {
    name: 'Glitch Beanie',
    description: 'A cozy knit beanie with a digital glitch pattern woven into the fabric. Perfect for staying warm while looking cool.',
    price: 25.00,
    stock: 300,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD9_F8qH3j_L1vX7mB_R5_P9tY_T6qM1v_L9_X6kY9mH8_R7yD8_J9qH8v_R5_P9tL1_R5_K9qL9_T5qV9'],
    rarity: 'STANDARD',
    category: 'Accessories',
    sizes: ['OS'],
    inStock: true
  },
  {
    name: 'Tech-Wear Cargo Pants',
    description: 'Durable, multi-pocket cargo pants made from water-resistant material. Features adjustable straps and a comfortable fit.',
    price: 120.00,
    stock: 100,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC9_R8qH3j_L1vX7mB_R5_P9tY_T6qM1v_L9_X6kY9mH8_R7yD8_J9qH8v_R5_P9tL1_R5_K9qL9_T5qV9'],
    rarity: 'CORE COLLECTION',
    category: 'Apparel',
    sizes: ['30', '32', '34', '36'],
    inStock: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing products and users');

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      email: 'admin@dopamine.club',
      passwordHash: hashedPassword,
      role: 'admin'
    });
    
    console.log('Created admin user: admin@dopamine.club / admin123');

    // Create Products
    const products = await Product.insertMany(productsData);
    console.log(`Successfully seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
