const mongoose = require("mongoose");

const FileSchema = mongoose.model('File', new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  fileName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
}));

module.exports = FileSchema;