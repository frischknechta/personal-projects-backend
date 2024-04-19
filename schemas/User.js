const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  avatar: Object,
  token: String,
  hash: String,
  salt: String,
});

module.exports = UserSchema;
