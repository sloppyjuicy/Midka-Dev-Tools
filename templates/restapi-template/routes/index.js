const express = require("express");
const router = express.Router();

// Routes
router.use("/info", require("./info"));

module.exports = router;
