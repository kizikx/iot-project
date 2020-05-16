const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let LightSchema = new Schema(
  {
    date: {type: Date, required: true},
    who: {type: String, required: true},
    value: {type: Number, required: true}
  }
);

module.exports = mongoose.model('Light', LightSchema, "light");