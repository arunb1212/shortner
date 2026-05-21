# Trimmer — Modern URL Shortener & Analytics Dashboard

A premium, ultra-minimal URL shortener and real-time performance analytics dashboard. Built with Vite, React, Tailwind CSS v4, Node.js, Express, and MongoDB.

---

## 📁 Repository Structure

The codebase is organized as a modular monorepo, perfectly divided for separate hosting:

```
├── backend/            # Express.js & MongoDB API (Deploy to Railway)
│   ├── routes/         # API Route Handlers (auth, url shortener)
│   ├── models/         # MongoDB Schemas (User, Url)
│   ├── middleware/     # Auth Token Validation
│   ├── index.js        # Server Main Entrypoint
│   └── package.json    # Backend Configuration & Scripts
│
└── frontend/           # Vite & React SPA Client (Deploy to Vercel)
    ├── src/            # React Codebase (Pages, Layout, Components)
    ├── public/         # Static Public Assets
    ├── index.html      # HTML Entrypoint
    └── package.json    # Frontend Configuration & Scripts
```

---

## 🚀 Local Development

For maximum convenience, you can run all commands directly from the monorepo root folder:

### 1. Run the Frontend (Client)
```bash
npm run dev:frontend
```
This launches the Vite Dev server on [http://localhost:5173](http://localhost:5173).

### 2. Run the Backend (API Server)
Ensure you have a MongoDB instance running locally (defaults to `mongodb://localhost:27017/shortner`), then run:
```bash
npm run dev:backend
```
This launches the backend API on [http://localhost:5000](http://localhost:5000) with hot-reloading active.

---

## 🌐 Production Hosting Guide

### 1. Frontend (Deploy to Vercel)

Vercel is optimized out-of-the-box for Vite SPAs:

1. Create a new project in your **Vercel Dashboard** and link this repository.
2. In the configuration settings, set the **Root Directory** to: `frontend`
3. Vercel will auto-detect **Vite** and configure the build settings.
4. Add the following **Environment Variable**:
   - `VITE_API_URL`: Set this to your live backend domain (e.g., `https://shortner-api.up.railway.app`). Do not add a trailing slash.

---

### 2. Backend (Deploy to Railway)

Railway is highly optimized for Node.js Express APIs:

1. Create a new project in your **Railway Dashboard** and link this repository.
2. Add a new service from your linked repository, and in the service **Settings**, set the **Root Directory** to: `backend`
3. Railway will auto-run `npm start` which launches the server.
4. Add the following **Environment Variables** under the variables tab:
   - `PORT`: (Railway injects this automatically)
   - `MONGODB_URI`: Connect to your Mongo Database service (e.g., Railway Mongo plugin or MongoDB Atlas cluster connection string)
   - `JWT_SECRET`: A secure secret string for cryptographic token signatures (e.g., `my-super-secret-key-12345`)
   - `FRONTEND_URL`: Set this to your live frontend URL on Vercel (e.g., `https://shortner.vercel.app`) to authorize CORS API calls.

---

## ⚡ Key Features

- **Top Navigation Shell**: Extremely clean and minimalist horizontal header bar styling.
- **Dynamic Charting**: Rich timeline visualization representing click throughput trends.
- **QR Code Matrix Drawer**: Toggles high-resolution QR matrix codes for every shortened campaign directly within list rows, with built-in instant PNG asset download capabilities.
- **Client-Side redirection**: Independent `/r/:shortCode` full-viewport route ensures lightning fast routing performance.
