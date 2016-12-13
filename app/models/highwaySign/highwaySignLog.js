var mongoose = require('mongoose');

var highwaySignLogSchema = {
  lat: {type: Number, required: true},
  lon: {type: Number, required: true},
  location: {type: String, required: true},
  date: {type: Date, required: true},
  readCount: {type: Number}
};

module.exports = new mongoose.Schema(highwaySignLogSchema);
module.exports.highwaySignLogSchema = highwaySignLogSchema;
