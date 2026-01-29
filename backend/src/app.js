const express = require("express");
require("./config/db");
require("./jobs/dueChecker.job");

const app = express();
app.use(express.json());

app.use("/admin", require("./routes/admin.routes"));

module.exports = app;
