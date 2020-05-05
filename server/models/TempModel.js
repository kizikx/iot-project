const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TempSchema = new Schema(
  {
    date: {type: Date, required: true},
    who: {type: String, required: true},
    value: {type: Number, required: true}
  }
);

module.exports = mongoose.model('Temp', TempSchema, "temp");