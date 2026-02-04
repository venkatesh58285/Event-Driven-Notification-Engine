const { Worker } = require("bullmq");
const redis = require("../config/redis");
const NotificationLog = require("../models/NotificationLog");
const transporter = require("../config/mailer");

console.log("🔧 [WORKER] Initializing worker...");

new Worker(
  "notification-queue",
  async (job) => {
    console.log("\n⚙️ [WORKER] Processing job:", job.id);
    console.log("📋 [WORKER] Job data:", JSON.stringify(job.data, null, 2));
    console.log("⏱️ [WORKER] Attempt:", job.attemptsMade + 1);

    try {
      const { userId, email, message } = job.data;
      console.log("📧 [WORKER] Preparing email to:", email);

      // Send actual email using nodemailer
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: message || "Service Reminder",
        html: `
          <h2>Service Reminder</h2>
          <p>Hello,</p>
          <p>${message || "Your service is due. Please schedule an appointment."}</p>
          <p>Best regards,<br/>Notification Service</p>
        `,
      };

      console.log("📤 [WORKER] Sending email with options:", {
        from: mailOptions.from,
        to: mailOptions.to,
      });
      const info = await transporter.sendMail(mailOptions);
      console.log(
        "✅ [WORKER] Email sent successfully! Response:",
        info.messageId,
      );

      // Log successful send
      await NotificationLog.create({
        userId,
        channel: "EMAIL",
        status: "success",
        recipientEmail: email,
        message,
      });
      console.log("✅ [WORKER] Log created in database");
    } catch (error) {
      console.error("❌ [WORKER] Email sending failed:", error.message);
      console.error("❌ [WORKER] Full error:", error);

      // Log failed send
      await NotificationLog.create({
        userId: job.data.userId,
        channel: "EMAIL",
        status: "failed",
        recipientEmail: job.data.email,
        error: error.message,
        message: job.data.message,
      });
      console.log("✅ [WORKER] Failed log created in database");

      throw error; // Re-throw so BullMQ retries
    }
  },
  { connection: redis },
)
  .on("active", (job) => {
    console.log(
      `\n🟢 [WORKER EVENT] Job ${job.id} is active (started processing)`,
    );
  })
  .on("completed", (job) => {
    console.log(`🟢 [WORKER EVENT] Job ${job.id} completed successfully`);
  })
  .on("failed", async (job, err) => {
    console.error(
      `🔴 [WORKER EVENT] Job ${job.id} failed after retries:`,
      err.message,
    );
    console.error(`🔴 [WORKER EVENT] Attempts made:`, job.attemptsMade);

    // Update log to mark as permanently failed
    await NotificationLog.updateOne(
      {
        userId: job.data.userId,
        status: "failed",
        createdAt: { $gte: new Date(Date.now() - 60000) },
      },
      {
        $set: { status: "failed_permanently", retrysFailed: job.attemptsMade },
      },
    );
  })
  .on("error", (err) => {
    console.error("🔴 [WORKER ERROR] Worker error:", err.message);
  });

console.log(
  "📧 [WORKER] Notification Worker started (real email sending enabled)",
);
