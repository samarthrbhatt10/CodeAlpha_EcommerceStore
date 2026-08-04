<div align="center">

  # ⚡ DOPAMINE CLUB ⚡
  ### *Next-Generation, Gamified E-Commerce Infrastructure for the Digital Native Economy.*

  [![Node.js](https://img.shields.io/badge/Node.js-v20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-Realtime_Chat-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
  [![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/samarthrbhatt10/CodeAlpha_EcommerceStore/actions)
  [![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

  <br />

  <p align="center">
    <b>An interactive, collectible-driven marketplace built as a full-stack showcase.</b><br />
    Dopamine Club is a gamified e-commerce concept featuring scheduled product drops, blind-box unboxing, real-time WebSocket chat, peer-to-peer trading (in progress), automated CI/CD quality gates, and role-based admin tooling.
  </p>

  <sub>Built for the CodeAlpha Full Stack Internship — started from a standard storefront spec, evolved into this concept. See <a href="docs/SCOPE_CHANGE.md">docs/SCOPE_CHANGE.md</a> for the full story.</sub>

</div>

---

## 🚀 Executive Summary

Most internship e-commerce projects are a static product grid, a cart, and a checkout form. **Dopamine Club** takes the same core requirements — auth, catalog, cart, orders — and builds a more distinctive product experience on top: scheduled drops instead of an always-on catalog, a blind-box unboxing reveal on acquisition, a Vault to view what you've collected, and a live chat layer for the community around it.

The goal was to demonstrate the same architectural discipline (RBAC, audit logging, CI-gated quality checks, provider-agnostic auth) applied to a more interesting product surface than a default storefront — while being upfront that collectible/gacha-style mechanics are engagement-driving by nature, and being deliberate about where that line sits.

---

## 🔥 Core Product Capabilities

### 🛍️ 1. Storefront
* Product catalog and detail pages with rarity tiers and live stock counts.
* Cart, checkout, and order dispatch backed by MongoDB.

### 🎁 2. Drops & Unboxing
* Scheduled release windows for new products ("Drops") rather than a static always-available catalog.
* Blind-box style unboxing reveal on acquisition — a collectible mechanic in the same spirit as trading card packs or mystery boxes. Worth naming plainly: this kind of variable-reward mechanic is engagement-driving by design, the same way a pack of cards is. It's used here deliberately and transparently, not dressed up as something else.

### 🔄 3. Peer-to-Peer Trade *(in progress)*
* Scaffolded for trading owned products between users via transactional MongoDB updates.
* **Not yet fully functional** — planned for a future version.

### 💬 4. Real-Time Community Chat
* `socket.io`-powered chat for discussing drops and coordinating trades.

### 🛡️ 5. Admin Dashboard
Role-locked (`role: "admin"`) console covering:
* Platform overview and KPI tracking
* Inventory management and drop scheduling
* Order fulfillment and shipment tracking
* Revenue and trade-activity analytics

---

## 🛠️ Architecture & Security

```text
┌─────────────────────────────────────────────────────────┐
│                      CLIENT SIDE                        │
│   Vanilla JS (ES6+) • HTML5 • CSS3                       │
└────────────────────────────┬────────────────────────────┘
                             │ REST API / WebSockets
┌────────────────────────────▼────────────────────────────┐
│                      SERVER SIDE                        │
│   Node.js v20 • Express.js • Socket.io • JWT Auth       │
└────────────────────────────┬────────────────────────────┘
                             │ Mongoose ORM
┌────────────────────────────▼────────────────────────────┐
│                      DATABASE                           │
│              MongoDB (Local / Atlas Cloud)              │
└─────────────────────────────────────────────────────────┘
```

### 🔒 Security
- Rate-limiting via `express-rate-limit`
- Hardened HTTP headers via `Helmet`
- NoSQL injection sanitization on all inputs
- Provider-agnostic JWT auth with `bcryptjs` password hashing
- Secrets via `.env`, never committed (see `.env.example`)

### 🧪 CI/CD
- GitHub Actions quality gate on every push
- `ESLint` for consistent code quality
- `Jest` + `Supertest` integration tests

---

## ⚡ Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) v20+
* MongoDB running locally on port `27017` (or an Atlas URI)
* Git

### 2. Clone & Install
```bash
git clone https://github.com/samarthrbhatt10/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```
Then fill in your own values for `MONGO_URI` and `JWT_SECRET` — never commit `.env`.

### 4. Demo Accounts
```bash
npm run seed
```
Creates a local admin account and a regular user account for testing. See `scripts/seedDatabase.js` for exactly what gets created — credentials are generated locally, not published in this README.

### 5. Test & Run
```bash
npm test
npm run lint
npm start
```
App runs at `http://localhost:3000`.

---

## 📂 Repository Structure

```text
CodeAlpha_EcommerceStore/
├── .github/workflows/        # CI/CD pipeline
├── docs/                     # Original PRD, architecture graphs, and SCOPE_CHANGE.md
├── middleware/                # RBAC, JWT auth, rate limiting
├── models/                    # Mongoose data models
├── routes/                    # REST API endpoints
├── services/                  # Audit logging & business logic
├── tests/                     # Jest/Supertest suites
├── public/                    # Client-side assets
│   ├── css/
│   ├── js/
│   └── ...
├── server.js                  # Express entry point
├── eslint.config.js
├── package.json
└── README.md
```

## 📜 License

MIT — see `LICENSE`.

<div align="center">
  <sub>Built for the CodeAlpha Full Stack Internship.</sub>
</div>