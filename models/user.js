const mongoose = require("mongoose");

const UserSchema = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true
  }
}));

module.exports = UserSchema;