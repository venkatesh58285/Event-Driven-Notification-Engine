# Frontend — Admin Dashboard

What this folder contains

- React + Vite admin UI (`src/pages/AdminDashboard.jsx`)
- Small HTTP client wrapper (`src/api.js`) pointing at the backend `http://localhost:5000/admin`

Prerequisites

- Node.js 16+ and npm
- Backend running at `http://localhost:5000` (see backend/README.md)

## Install and run

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm run dev
# opens at http://localhost:5173
```

## How to test email sending

1. Open the dashboard in the browser: `http://localhost:5173`
2. Use the "Create & Schedule Email" form to send a test email:
   - Provide `userId` and the recipient `email` address
   - Write a `message` and set `Delay` to `0` to send immediately
3. The frontend will call `POST /admin/notification` on the backend
4. The worker sends the email and logs the result to the backend


# Frontend — Minimal

Tech / packages used

- `react`, `react-dom` — UI library
- `vite` — dev server and bundler
- `axios` — HTTP client used to call the backend

Why

- Lightweight React + Vite setup for fast development.


