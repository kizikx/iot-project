const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    id: {type: String, required: true},
    password: {type: String, required: true}
  }
);

module.exports = mongoose.model('User', UserSchema, "user");