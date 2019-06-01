const express = require("express");
const router = express.Router();

const passport = require("passport");


router.get("/", (req, res) => {
  res.send("Files index");
});

router.use(passport.authenticate('jwt', {session: false}));

router.post("new", (req, res) => {

});

module.exports = router;