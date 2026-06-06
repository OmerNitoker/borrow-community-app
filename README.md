# Borrow

Borrow is a full-stack community item-sharing app for private communities.

Users can create or join communities, lend items, browse items shared by approved members, and access owner contact details only when the backend authorization rule allows it.

## Product Goal

The app is built as a professional Junior Full Stack Developer portfolio project:

- solve a real community need
- demonstrate full-stack product thinking
- show backend authorization discipline
- provide a recruiter-friendly demo flow

## Core Business Rule

Owner contact details are returned only when the current user is authenticated, approved in the item's community, and either:

- is a community admin, or
- has at least 3 active items in that same community.

If the user owns the item, their own contact details are not returned.

The backend must never expose owner contact details unless this rule passes.

## Current Features

- JWT cookie auth
- Demo login
- Persistent demo community
- Demo reset command
- Create community
- Join community by code
- Optional admin approval for joining
- Membership approval/rejection
- Community catalog
- Item CRUD
- Soft-delete / hide items
- Cloudinary image upload
- Backend image resize/compression with Sharp
- Up to 3 images per item
- Image deletion
- Private user profile
- Admin dashboard
- Contact access logic
- Hebrew RTL interface

## Tech Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS
- Backend: Node.js, Express, JavaScript
- Database: MongoDB
- Auth: JWT stored in HTTP-only cookies
- Images: Cloudinary
- Image processing: Sharp

## Project Structure

```text
backend/
  scripts/
  src/
    config/
    constants/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/

frontend/
  src/
    api/
    components/
    constants/
    context/
    pages/
    styles/
    utils/
```

## Setup

Install dependencies:

```bash
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
MONGODB_URI=mongodb://127.0.0.1:27017/borrow
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=borrow
IMAGE_MAX_WIDTH=1600
IMAGE_QUALITY=86
```

Optional root `.env` can also hold local shared values during development.

## Scripts

```bash
npm run dev
npm run dev:backend
npm run dev:frontend
npm run test:backend
npm run reset:demo
```

## Demo Data

Recruiters can click `כניסה לדמו` and enter a populated demo community.

The demo reset command restores the seeded demo user, community, membership, and items:

```bash
npm run reset:demo
```

Seeded demo data can be restored at any time with the reset command, which makes it safe to test demo changes locally.

## Image Handling

Uploaded images are processed before Cloudinary upload:

- max width: 1600px
- output format: WebP
- quality: 86
- max upload size: 5MB
- max images per item: 3

This keeps the app fast and helps the Cloudinary free plan last longer.

## Deployment

Recommended MVP hosting:

- Frontend: Vercel
- Backend: Render Web Service
- Database: MongoDB Atlas
- Images: Cloudinary

### Backend production environment

Set these variables on the backend host:

```env
NODE_ENV=production
CLIENT_URLS=https://your-frontend-domain.vercel.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-long-random-production-secret
JWT_EXPIRES_IN=7d
COOKIE_SAME_SITE=none
COOKIE_SECURE=true

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=borrow
IMAGE_MAX_WIDTH=1600
IMAGE_QUALITY=86
```

Use `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` when the frontend and backend are deployed on different sites, such as Vercel and Render.

### Frontend production environment

Set this variable on the frontend host:

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

The frontend includes `frontend/vercel.json` so Vercel serves `index.html` for direct SPA routes such as `/profile` and `/communities/:id`.

### Render backend settings

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Vercel frontend settings

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Before deploying, run:

```bash
npm run test:backend
npm run build --workspace frontend
```

## QA

Use [QA_CHECKLIST.md](./QA_CHECKLIST.md) before sharing the app externally.
