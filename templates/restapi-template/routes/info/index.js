const express = require("express");
const router = express.Router();

// Routes
/* 
  @method GET
  @route /api/info
  @description This is an example route
*/
router.get("/", (req, res) => {
  res.send("Just a test");
});

module.exports = router;
