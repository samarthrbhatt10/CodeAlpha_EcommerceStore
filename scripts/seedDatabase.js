require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Real products with working Unsplash images — diverse streetwear/collectibles catalog
const productsData = [
  {
    name: 'Cyber-Mecha Vinyl Figure',
    description: 'Limited-edition designer vinyl toy with cybernetic enhancements and translucent neon body. Hand-painted details, UV-reactive finish. Comes in collector box with certificate of authenticity. Only 500 units worldwide.',
    price: 189.00,
    originalPrice: 220.00,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80'
    ],
    rarity: 'LEGENDARY DROP',
    category: 'Collectibles',
    sizes: ['OS'],
    tags: ['vinyl', 'collectible', 'limited', 'designer'],
    rating: 4.9,
    reviewCount: 143,
    inStock: true,
    isFeatured: true
  },
  {
    name: 'Holographic Prism Hoodie',
    description: 'Premium heavyweight hoodie with iridescent holographic fabric panels. 380gsm fleece interior for maximum comfort. Oversized silhouette with kangaroo pocket and adjustable drawstring. Machine washable.',
    price: 148.00,
    originalPrice: 195.00,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?w=800&q=80'
    ],
    rarity: 'VAULT ITEM',
    category: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    tags: ['hoodie', 'holographic', 'streetwear', 'premium'],
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    isFeatured: true
  },
  {
    name: 'Neon Platform Sneakers',
    description: 'Chunky retro-futurist platform sneakers with glow-in-the-dark soles and reflective 3M paneling. EVA foam cushioning for all-day comfort. Lug sole with 4cm platform height. Available in US sizes.',
    price: 229.00,
    originalPrice: 280.00,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'
    ],
    rarity: 'LIMITED EDITION',
    category: 'Footwear',
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    tags: ['sneakers', 'platform', 'glow', 'chunky'],
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    isFeatured: true
  },
  {
    name: 'Glitch Art Bucket Hat',
    description: 'Unstructured bucket hat featuring all-over glitch art digital print. 100% cotton canvas with UV protection. Adjustable cord. Reversible design — wear solid black or full print side.',
    price: 42.00,
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80'
    ],
    rarity: 'STANDARD',
    category: 'Accessories',
    sizes: ['S/M', 'L/XL'],
    tags: ['hat', 'bucket', 'glitch', 'print'],
    rating: 4.4,
    reviewCount: 467,
    inStock: true,
    isFeatured: false
  },
  {
    name: 'Techwear Cargo Pants',
    description: 'Utility cargo pants built for the urban explorer. Ripstop nylon shell, water-resistant DWR coating. 10 functional pockets including hidden thigh zipper compartment. Adjustable ankle straps.',
    price: 198.00,
    originalPrice: 245.00,
    stock: 67,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4268?w=800&q=80',
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80'
    ],
    rarity: 'CORE COLLECTION',
    category: 'Apparel',
    sizes: ['28', '30', '32', '34', '36', '38'],
    tags: ['cargo', 'techwear', 'pants', 'utility'],
    rating: 4.6,
    reviewCount: 231,
    inStock: true,
    isFeatured: false
  },
  {
    name: 'Acid Wash Oversized Tee',
    description: 'Heavyweight 250gsm tee with unique acid wash treatment — no two are exactly alike. Drop-shoulder fit with raw-cut hem. Pre-washed for a broken-in feel. Printed with UV-reactive ink on chest.',
    price: 65.00,
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80'
    ],
    rarity: 'STANDARD',
    category: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    tags: ['tee', 'acid-wash', 'graphic', 'oversized'],
    rating: 4.5,
    reviewCount: 589,
    inStock: true,
    isFeatured: false
  },
  {
    name: 'Translucent Chain Bag',
    description: 'Y2K-inspired translucent PVC crossbody bag with heavy-duty silver chain strap. Snap closure with interior zip pocket. Holographic sticker details on exterior. Fits standard phone + wallet essentials.',
    price: 78.00,
    originalPrice: 95.00,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'
    ],
    rarity: 'VAULT ITEM',
    category: 'Accessories',
    sizes: ['OS'],
    tags: ['bag', 'y2k', 'transparent', 'chain'],
    rating: 4.3,
    reviewCount: 178,
    inStock: true,
    isFeatured: false
  },
  {
    name: 'Cyber Parka Jacket',
    description: 'Statement outerwear with bio-mimetic outer shell and modular detachable hood. 12 integrated pockets, reflective holographic panels, waterproof IPX7 rated. Comes with matching waist bag.',
    price: 449.00,
    originalPrice: 520.00,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
    ],
    rarity: 'LEGENDARY DROP',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['jacket', 'parka', 'cyber', 'waterproof', 'featured'],
    rating: 5.0,
    reviewCount: 42,
    inStock: true,
    isFeatured: true
  },
  {
    name: 'RGB Snapback Cap',
    description: 'Flat-brim snapback with embroidered RGB logo that actually lights up via micro-LED strips powered by a hidden USB-C rechargeable battery. 4-hour battery life. Water resistant.',
    price: 95.00,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'
    ],
    rarity: 'LIMITED EDITION',
    category: 'Accessories',
    sizes: ['S/M', 'L/XL'],
    tags: ['cap', 'snapback', 'rgb', 'led'],
    rating: 4.7,
    reviewCount: 66,
    inStock: true,
    isFeatured: false
  },
  {
    name: 'Dopamine Club Bomber',
    description: 'Satin varsity bomber with embroidered Dopamine Club branding. Ribbed knit collar, cuffs and hem. Contrasting sleeve panels. Fully lined with custom club logo interior lining. True to size.',
    price: 285.00,
    originalPrice: 320.00,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4268?w=800&q=80',
      'https://images.unsplash.com/photo-1553889574-3f4f4b5b2f1c?w=800&q=80'
    ],
    rarity: 'CORE COLLECTION',
    category: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['bomber', 'varsity', 'satin', 'embroidered'],
    rating: 4.8,
    reviewCount: 193,
    inStock: true,
    isFeatured: true
  },
  {
    name: 'Glow-In-Dark Beanie',
    description: 'Ribbed knit beanie with phosphorescent yarn woven throughout. Charges from any light source and glows for 2-3 hours in darkness. Slouchy fit. One-size-fits-most with stretch material.',
    price: 38.00,
    stock: 300,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
      'https://images.unsplash.com/photo-1480926965639-9b5f3b6c1e9f?w=800&q=80'
    ],
    rarity: 'STANDARD',
    category: 'Accessories',
    sizes: ['OS'],
    tags: ['beanie', 'glow', 'knit', 'winter'],
    rating: 4.2,
    reviewCount: 744,
    inStock: true,
    isFeatured: false
  },
  {
    name: 'Holo Trail Runners',
    description: 'Lightweight trail-to-street sneakers with holographic upper panels and cork midsole. Breathable mesh liner. Gripped Vibram-style rubber outsole. Perfect crossover between performance and style.',
    price: 185.00,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    ],
    rarity: 'VAULT ITEM',
    category: 'Footwear',
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    tags: ['sneakers', 'trail', 'holographic', 'running'],
    rating: 4.6,
    reviewCount: 127,
    inStock: true,
    isFeatured: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({ email: 'admin@dopamine.club', passwordHash: hashedPassword, role: 'admin' });
    console.log('👤 Created admin: admin@dopamine.club / admin123');

    // Demo User
    const demoHash = await bcrypt.hash('demo123', salt);
    await User.create({ email: 'demo@dopamine.club', passwordHash: demoHash, role: 'user' });
    console.log('👤 Created demo user: demo@dopamine.club / demo123');

    const products = await Product.insertMany(productsData);
    console.log(`🛍️  Seeded ${products.length} products successfully`);
    
    products.forEach(p => console.log(`  - ${p.name} ($${p.price}) [${p.category}]`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
