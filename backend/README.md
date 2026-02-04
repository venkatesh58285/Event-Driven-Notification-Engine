# Backend — Event-Driven Notification Engine

# Backend — Minimal

Tech / packages used

- `express` — HTTP API server
- `bullmq`, `ioredis` — job queue backed by Redis
- `nodemailer` — sending emails via SMTP
- `mongoose` — MongoDB models
- `node-cron` — scheduled daily checks
- `dotenv` — environment variable loader

Why

- Use a queue (BullMQ + Redis) to decouple email sending from API requests and support delays/retries.

How to run

1. Create `.env` in `backend/` with:

```
MONGO_URL=<your-mongo-connection-string>
EMAIL_SERVICE=gmail
EMAIL_USER=you@example.com
EMAIL_PASS=<app-password>
EMAIL_FROM=YourApp <you@example.com>
```

2. Install and start

```bash
cd backend
npm install
node src/server.js
```

Server listens on port `5000` by default; worker starts automatically.
