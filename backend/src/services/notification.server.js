const notificationQueue = require("../queues/notification.queue");

async function scheduleServiceDue(user) {
  await notificationQueue.add(
    "SERVICE_DUE",
    {
      userId: user._id,
      email: user.email
    },
    {
      delay: 24 * 60 * 60 * 1000, // 1 day
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      jobId: `SERVICE_DUE_${user._id}`
    }
  );
}

module.exports = { scheduleServiceDue };
