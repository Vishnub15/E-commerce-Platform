# Aura Premium E-Commerce Platform ⚡

Welcome to the **Aura Premium E-Commerce Platform**, a high-end, full-stack online store solution built with a modern React SPA frontend (powered by Vite) and a robust Node.js/Express REST API backend. It features an automated local SQLite database integration, JWT-based user authorization, a sliding drawer shopping cart, simulated Stripe card checkout processing, and an administrative control panel.

---

## 🚀 Getting Started

To run this application locally, you will need to have **Node.js** installed on your system.

### 📦 1. Backend Setup

1. Open a terminal window and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install all necessary dependencies (Sequelize, SQLite, Express, JWT, bcrypt):
   ```bash
   npm install
   ```
3. Initialize and seed the SQLite database. This creates all tables, seeds default high-quality products, and populates mock user/admin accounts:
   ```bash
   npm run seed
   ```
4. Start the Express backend server:
   ```bash
   npm run dev
   ```
   *The API will start listening at `http://localhost:5000`.*

---

### 💻 2. Frontend Setup

1. Open a second terminal window (or split your current terminal) and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies (React, Vite, React Router, Lucide Icons, TypeScript):
   ```bash
   npm install
   ```
3. Start the Vite development hot-reload server:
   ```bash
   npm run dev
   ```
   *The React application will launch at `http://localhost:5173`.*

---

## 🔒 Demo Authentication Accounts

To make manual validation quick and easy, the database is pre-seeded with these credentials:

### 👤 1. Regular Customer Account
- **Email:** `user@store.com`
- **Password:** `user123`
- *Use this to add items to the cart, go through checkout with mock card details, and view purchase history.*

### 🛠️ 2. Administrator Account
- **Email:** `admin@store.com`
- **Password:** `admin123`
- *Use this to access the **Admin Console** dashboard to add/edit/delete catalog products, track system sales, update orders to "Shipped" or "Delivered", and view all user account entries.*

---

## 🛡️ Key Features

- **Obsidian Glass Design:** Features a premium UI theme utilizing backdrop filters, glowing borders, slide animations, and cohesive colors.
- **Dynamic Catalog Filters:** Live text searching and tab-based category listing with price sorting.
- **Sliding Drawer Cart:** Sidebar drawer updating cart quantities and calculating subtotals dynamically.
- **Secure Mock Checkout:** Simulates a realistic billing form and deducts quantities directly from inventory database records.
- **Admin Dashboard Panel:** Fully functional product management tables (with add/edit modals) and order fulfillment controllers.
- **SQLite Persistence:** Uses Sequelize ORM mapping, maintaining data inside a lightweight local file database (`backend/database.sqlite`).
