<div align="center">

  # ⚡ DOPAMINE CLUB ⚡
  ### *The Cyberpunk, Gamified Pop-Mart Storefront That Ruins Boring E-Commerce Forever.*

  [![Node.js](https://img.shields.io/badge/Node.js-v20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-Realtime_Chat-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
  [![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

  <br />

  <p align="center">
    <b>Forget plain white grids, boring spinners, and standard shopping carts.</b><br />
    Welcome to <b>Dopamine Club</b> — a full-stack, gamified e-commerce ecosystem built with high-octane UI aesthetics, P2P item trading, real-time WebSockets squad chat, mystery box unboxing mechanics, and an Admin War Room.
  </p>

  <sub>Built with ❤️ and sheer caffeine for CodeAlpha Full Stack Internship.</sub>

</div>

---

## 🚀 Why This Project Exists

Let’s be real for a second: **99% of e-commerce portfolio projects look identical.** 
They have a simple navbar, 4 product cards, a static cart, and a fake Stripe button. We got bored of building the same basic template everyone else builds. 

So we built **Dopamine Club**. 

Inspired by modern blind-box cultures like *Pop Mart* and high-tech tactical HUD interfaces, **Dopamine Club** turns standard online shopping into an interactive, high-dopamine playground with real backend architecture, real-time WebSocket communication, and zero bloated frontend frameworks.

---

## 🔥 Key Tactical Features

### 🛍️ 1. Next-Gen Storefront & Vault Catalog
* **Tactical Glassmorphism UI**: High-density dark aesthetics, dynamic hover states, glowing badges, and curated Bento-Grid layouts.
* **Dynamic Cart & Checkout**: Instant loot-bag accumulation, price calculation, and seamless order dispatching connected to MongoDB.
* **Interactive PDP (Product Detail Pages)**: Rich imagery, hype stats, rarity scores, and real-time inventory counters.

### 🎁 2. Mystery Box Unboxing & Drop Vaults
* **Live Countdown Timers**: Real-time ticker for drop events (T-Minus zero releases).
* **Unboxing Mechanics**: High-dopamine reveal sequences for blind-box loot drops.

### 🔄 3. P2P Global Trade Command Hub
* **Player-to-Player Item Swapping**: Trade items directly from your inventory with other squad members.
* **Trade Offer Management**: Send, accept, or reject incoming trade proposals dynamically updated in MongoDB.

### 💬 4. Real-Time Encrypted Squad Chat
* **WebSocket Integration**: Built-in `socket.io` broadcast engine allowing collectors to flex pulls and chat live in real-time.
* **Live Audit Log**: Track user actions, order placements, and squad recruitment live.

### 🛡️ 5. "War Room" Admin Intelligence Suite
Restricted, role-authenticated (`role: "admin"`) dispatcher control center divided into 4 specialized command views:
* 🛰️ **Mission Control**: Live dashboard overview.
* 📦 **Inventory Intel**: Manage stock, rarity rates, and drop items.
* 📜 **Order Intelligence**: Track and process incoming customer shipments.
* 📊 **Strategic Analytics**: Visual metrics on revenue, user retention, and trade velocity.

---

## 🛠️ Tech Stack & Architecture

We intentionally kept the stack **lean, lightning-fast, and zero-bloat**.

```text
┌─────────────────────────────────────────────────────────┐
│                      CLIENT SIDE                        │
│   Vanilla JS (ES6+) • HTML5 • Glassmorphism CSS3        │
└────────────────────────────┬────────────────────────────┘
                             │ REST API / WebSockets
┌────────────────────────────▼────────────────────────────┐
│                      SERVER SIDE                        │
│   Node.js • Express.js • Socket.io Engine • JWT Auth    │
└────────────────────────────┬────────────────────────────┘
                             │ Mongoose ORM
┌────────────────────────────▼────────────────────────────┐
│                      DATABASE                           │
│              MongoDB (Local / Atlas Cloud)              │
└─────────────────────────────────────────────────────────┘
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Vanilla JavaScript (Modular ES6), Semantic HTML5, Custom Vanilla CSS (Bento Grid, Dynamic HUDs) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB & Mongoose ORM |
| **Real-Time** | Socket.io (WebSockets) |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing, RBAC Middleware |

---

## ⚡ Quick Start Guide

Want to run **Dopamine Club** on your local machine in under 60 seconds? Follow along!

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017` (or a MongoDB Atlas URI)
* Git

### 2. Clone the Repository
```bash
git clone https://github.com/samarthrbhatt10/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_dopamine_jwt_key_123!
```

### 5. Launch the Server!
```bash
npm start
```
Boom! Open your browser and navigate to:
```text
🌐 http://localhost:3000
```

---

## 🔐 Credentials for Testing

To make testing as quick as possible, here are ready-to-use credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Tactical Admin** | `admin@dopamine.club` | `admin123` | Full Access to Admin War Room (`/admin_dashboard`) |
| **Collector User** | `user@dopamine.club` | `user123` | Standard Storefront, Trade & Unboxing Access |

---

## 📂 Clean & Modular Project Structure

```text
CodeAlpha_EcommerceStore/
├── middleware/
│   ├── authMiddleware.js     # JWT Verification
│   └── rbacMiddleware.js     # Role Authorization (Admin Guard)
├── models/
│   ├── Message.js            # Squad Chat Schema
│   ├── Order.js              # Orders & Line Items Schema
│   ├── Product.js            # Store Items & Rarity Schema
│   ├── Trade.js              # P2P Inventory Trade Schema
│   └── User.js               # Gamified User Stats Schema
├── routes/
│   ├── authRoutes.js         # Register, Login, & User Stats API
│   ├── dropRoutes.js         # Live Drop Timers API
│   ├── orderRoutes.js        # Checkout & Orders API
│   ├── productRoutes.js      # Catalog & PDP API
│   ├── tradeRoutes.js        # P2P Item Swap API
│   └── vaultRoutes.js        # Mystery Box Vault API
├── public/                   # Production-Ready HTML & Static Assets
│   ├── css/                  # Curated Dark Theme & Animations
│   ├── js/                   # Dynamic Client-side Fetch Handlers
│   ├── home.html             # The Dopamine Portal
│   ├── catalog.html          # Drop Vault Catalog
│   ├── pdp.html              # Product Detail View
│   ├── cart.html             # Loot Bag & Checkout
│   ├── profile.html          # Player Stats & Inventory Profile
│   ├── trade.html            # Global Trade Command Hub
│   ├── unboxing.html         # Mystery Box Reveal UI
│   ├── chat.html             # Encrypted Squad Channel
│   ├── admin_dashboard.html  # Mission Control Center
│   └── ...                   # Additional Tactical Views
├── server.js                 # Express Application Entry Point
├── package.json
└── README.md
```

---

## 🌟 Show Your Support

If you like this project, find the design aesthetic inspiring, or learned something useful from the real-time WebSockets & trade architecture:

⭐ **Give this repository a STAR!** It helps more developers discover non-boring full-stack projects.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Designed & Developed with high passion for <b>CodeAlpha</b>.</sub>
</div>
