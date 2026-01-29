const User = require("../models/User");
const NotificationLog = require("../models/NotificationLog");

exports.getDashboard = async (req, res) => {
  const dueUsers = await User.find({
    nextServiceDate: { $lte: new Date() }
  });

  const logs = await NotificationLog.find().sort({ createdAt: -1 });

  res.json({ dueUsers, logs });
};
