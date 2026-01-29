const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: String,
  channel: String,
  status: String,
  error: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("NotificationLog", logSchema);
