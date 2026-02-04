Event-Driven Notification & WorkFlow Engine

Architecture
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React)                    │
│  - Dashboard to view logs & due users               │
│  - Form to manually send test emails                │
└────────────────┬────────────────────────────────────┘
                 │
                 │ HTTP POST /notification
                 ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (Node.js/Express)              │
│  - Controller validates & queues job                │
│  - Routes handle incoming requests                  │
│  - Redis connection config                          │
│  - Gmail/nodemailer config                          │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Add to queue
                 ▼
┌─────────────────────────────────────────────────────┐
│           REDIS QUEUE (BullMQ)                      │
│  - Fast, in-memory job queue                        │
│  - Handles delays, retries, persistence             │
│  - Worker picks up jobs                             │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Job ready to process
                 ▼
┌─────────────────────────────────────────────────────┐
│              WORKER (Node.js Process)               │
│  - Listens for jobs in queue                        │
│  - Sends email via Gmail API                        │
│  - Logs result to MongoDB                           │
│  - Retries on failure                               │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Save status
                 ▼
┌─────────────────────────────────────────────────────┐
│           MONGODB (Database)                        │
│  - Users collection (customer data)                 │
│  - NotificationLog (email history)                  │
└─────────────────────────────────────────────────────┘