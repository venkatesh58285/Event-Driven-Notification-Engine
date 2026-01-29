const cron = require("node-cron");
const User = require("../models/User");
const { scheduleServiceDue } = require("../services/notification.service");

cron.schedule("0 0 * * *", async () => {
  const today = new Date();

  const dueUsers = await User.find({
    nextServiceDate: { $lte: today }
  });

  for (const user of dueUsers) {
    await scheduleServiceDue(user);
  }
});
