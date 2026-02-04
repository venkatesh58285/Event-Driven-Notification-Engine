const router = require("express").Router();
const {
  getDashboard,
  createNotification,
} = require("../controllers/admin.controller");

router.get("/dashboard", getDashboard);
router.post("/notification", createNotification);

module.exports = router;
