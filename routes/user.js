const express = require("express");
const router = express.Router();

router.post("/new", (req, res) => {
  res.send("users!");
});

module.exports = router;