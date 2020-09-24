const express = require("express");
const router = express.Router();

// Routes
/* 
  @route /api/info
  @description This is an example route
*/
router.use("/info", require("./info"));

module.exports = router;
