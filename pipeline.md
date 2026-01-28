PIPELINE (END-TO-END)

1️⃣ Customer data stored
→ MongoDB / PostgreSQL (profile, email, phone, due dates)

2️⃣ Due checker runs
→ Cron job (node-cron) checks “what is due today”

3️⃣ Event created
→ Node API creates event like SERVICE_DUE

4️⃣ Event pushed to queue
→ BullMQ queue.add() (fast, async)

5️⃣ Workflow rules applied
→ Delay + retry config added to job

6️⃣ Worker picks job
→ BullMQ Worker processes job

7️⃣ Notification sent
→ Nodemailer / SMS API

8️⃣ Failure handling
→ Automatic retry → DLQ after max attempts

9️⃣ Logs saved
→ DB for audit + monitoring

That’s the full pipeline