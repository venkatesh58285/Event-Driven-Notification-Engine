const User = require("../models/User");
const NotificationLog = require("../models/NotificationLog");
const notificationQueue = require("../queues/notification.queue");

exports.getDashboard = async (req, res) => {
  const dueUsers = await User.find({
    nextServiceDate: { $lte: new Date() },
  });

  const logs = await NotificationLog.find().sort({ createdAt: -1 });

  res.json({ dueUsers, logs });
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, email, message, delayMs } = req.body;
    console.log("\n📨 [CONTROLLER] Received request:", {
      userId,
      email,
      message,
      delayMs,
    });

    // Validate input
    if (!userId || !email || !message) {
      console.error("❌ [CONTROLLER] Validation failed - missing fields");
      return res
        .status(400)
        .json({ error: "userId, email, and message are required" });
    }

    console.log("✅ [CONTROLLER] Validation passed");

    // Add job to queue with delay
    console.log("⏳ [CONTROLLER] Adding job to queue with delay:", delayMs);
    const job = await notificationQueue.add(
      "send-email",
      {
        userId,
        email,
        message,
        createdAt: new Date(),
      },
      {
        delay: delayMs || 0, // delay in milliseconds (0 = send immediately)
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    );

    console.log("✅ [CONTROLLER] Job added to queue - Job ID:", job.id);

    res.json({
      success: true,
      message: `✅ Email scheduled! Job ID: ${job.id} (Delay: ${(delayMs || 0) / 1000}s)`,
      jobId: job.id,
      delaySeconds: (delayMs || 0) / 1000,
    });
  } catch (error) {
    console.error("❌ [CONTROLLER] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
