const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let EspSchema = new Schema(
  {
    who: {type: String, required: true, unique: true},
    subscribeDate: {type: Date, required: true},
    name: {type: String, required: true, unique: true},
    position: {
      posX: { type: Number, lowercase: true, trim: true },
      posY: { type: Number, lowercase: true, trim: true }
    },
    size: { type: Number, lowercase: true, trim: true }

  }
);

module.exports = mongoose.model('Esp', EspSchema, "esp");