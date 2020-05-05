const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true},
    administrator: {type: Boolean, required: true, default: false },
  }
);

module.exports = mongoose.model('User', UserSchema, "user");