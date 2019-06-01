const express = require("express");
const router = express.Router();

const config = require("../config");
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require("../models/user");

router.post("/new", async (req, res) =>{
  const {username, password} = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({username, passwordHash});
    await newUser.save();
    
    res.status(200).json({status: "success", user: newUser});
  } catch(error) {
    res.status(400).json({error: "Failed to create user."});
    // res.status(400).json(error);
  }
});

router.post('/auth', (req, res) => {
  passport.authenticate('local', { session: false },
    (error, user) => {
      if (error || !user) {
        res.status(400).json({ error });
        return;
      }

      const payload = {
        username: user.username,
        expires: Date.now() + config.JWT_EXPIRATION_MS,
      };

      req.login(payload, {session: false}, (error) => {
        if (error) {
          res.status(400).json({ error });
        } else {
          const token = jwt.sign(JSON.stringify(payload), config.secret);
          res.json({ token: token });
        }
      });
    },
  )(req, res);
});

// Anything below will require a valid JWT
//router.use(passport.authenticate('jwt', {session: false}));

// router.get("/:uid", (req, res) => {
//   console.log(req.params.uid);
//   UserModel.find({_id: req.params.uid}, (error, data) => {
//     res.json(data);
//   });
// });


module.exports = router;