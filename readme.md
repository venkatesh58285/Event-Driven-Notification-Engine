Event-Driven Notification & Workflow Engine

## Overview

This project is a lightweight, event-driven notification engine that:

- Periodically checks which users have upcoming or overdue service dates.
- Queues notification jobs (Redis + BullMQ) instead of sending directly.
- Processes queued jobs with a worker that sends emails (nodemailer).
- Logs all notification attempts in MongoDB for audit and retries.

## Why use this

- Decouples user requests from slow I/O (email sending).
- Enables retries, delays, and failure handling without blocking the API.
- Simple admin UI for manual testing and monitoring.

## Quick links

- Backend: backend README for server, worker and env setup — see [backend/README.md](backend/README.md)
- Frontend: frontend README for dev server and UI — see [frontend/README.md](frontend/README.md)

If you want to run everything locally, follow the step-by-step guides in the backend and frontend READMEs.

Architecture
┌─────────────────────────────────────────────────────┐
│ FRONTEND (React) │
│ - Dashboard to view logs & due users │
│ - Form to manually send test emails │
└────────────────┬────────────────────────────────────┘
│
│ HTTP POST /notification
▼
┌─────────────────────────────────────────────────────┐
│ BACKEND (Node.js/Express) │
│ - Controller validates & queues job │
│ - Routes handle incoming requests │
│ - Redis connection config │
│ - Gmail/nodemailer config │
└────────────────┬────────────────────────────────────┘
│
│ Add to queue
▼
┌─────────────────────────────────────────────────────┐
│ REDIS QUEUE (BullMQ) │
│ - Fast, in-memory job queue │
│ - Handles delays, retries, persistence │
│ - Worker picks up jobs │
└────────────────┬────────────────────────────────────┘
│
│ Job ready to process
▼
┌─────────────────────────────────────────────────────┐
│ WORKER (Node.js Process) │
│ - Listens for jobs in queue │
│ - Sends email via Gmail API │
│ - Logs result to MongoDB │
│ - Retries on failure │
└────────────────┬────────────────────────────────────┘
│
│ Save status
▼
┌─────────────────────────────────────────────────────┐
│ MONGODB (Database) │
│ - Users collection (customer data) │
│ - NotificationLog (email history) │
└─────────────────────────────────────────────────────┘
