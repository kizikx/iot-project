const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true}
  }
);

module.exports = mongoose.model('User', UserSchema, "user");