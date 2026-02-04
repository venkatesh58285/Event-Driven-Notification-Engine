const express = require("express");
require("./config/db");
require("./config/mailer");
require("./jobs/dueChecker.job");
require("./workers/notification.worker");

const app = express();
app.use(express.json());

// Allow CORS from frontend (Vite dev server)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use("/admin", require("./routes/admin.routes"));

module.exports = app;
