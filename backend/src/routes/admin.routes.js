const router = require("express").Router();
const { getDashboard } = require("../controllers/admin.controller");

router.get("/dashboard", getDashboard);

module.exports = router;
