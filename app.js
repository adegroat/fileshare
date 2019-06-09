const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require("bcrypt");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path")

const UserModel = require("./models/user");

// Connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true });

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(fileUpload({createParentPath: true}));
app.use(express.static(path.join(__dirname, "build")));

// Passport stuff
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const userDocument = await UserModel.findOne({username: username}).exec();
    const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

    if (passwordsMatch) {
      // console.log(userDocument);
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

app.use("/api/users", usersRoute);
app.use("/api/files", filesRoute);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(9000);