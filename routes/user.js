const express = require("express");
const router = express.Router();

router.post("/new", (req, res) => {
  console.log(req.body.username);
  res.end();
});

router.post("/auth", (req, res) =>{
  res.json({status: "error"});
});

module.exports = router;