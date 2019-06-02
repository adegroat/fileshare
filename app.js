const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config");

const UserModel = require("./models/user");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');

// Connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true });

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(fileUpload({createParentPath: true}));

// Passport stuff
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const userDocument = await UserModel.findOne({username: username}).exec();
    const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

    if (passwordsMatch) {
      console.log(userDocument);
      return done(null, userDocument);
    } else {
      return done('Incorrect Username / Password');
    }
  } catch (error) {
    done(error);
  }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.body.jwt || req.query.jwt,
    secretOrKey: config.secret,
  },
  (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done("invalid_token");
    }

    return done(null, jwtPayload);
  }
));

// Routes
const usersRoute = require("./routes/users");
const filesRoute = require("./routes/files");

app.use("/users", usersRoute);
app.use("/files", filesRoute);

app.get("/", (req, res) => {
  let output = "<h1>File Sharing Website</h1>";
  output += "<p>More info will be available soon.</p>";

  res.send(output);
});

app.listen(9000);