const mongoose = require("mongoose");

const UserSchema = mongoose.model('User', new mongoose.schema({
  username: String,
  email: String,
  password: String
}));

module.exports = UserSchema;