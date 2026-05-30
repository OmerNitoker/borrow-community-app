# Borrow

Borrow is a full-stack community item-sharing app for private communities.

Users can create or join communities, lend items, browse items shared by approved members, and access owner contact details only when the backend authorization rule allows it.

## Tech Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS
- Backend: Node.js, Express, JavaScript
- Database: MongoDB
- Auth: JWT stored in HTTP-only cookies
- Images: Cloudinary

## Core Contact Rule

Owner contact details are returned only when the current user is authenticated, approved in the item's community, and either:

- is a community admin, or
- has at least 3 active items in that same community.

The backend must never expose owner contact details unless this rule passes.

## Scripts

```bash
npm run dev
npm run dev:backend
npm run dev:frontend
npm run reset:demo
```

## Setup

```bash
npm run install:all
cp .env.example backend/.env
npm run dev
```
