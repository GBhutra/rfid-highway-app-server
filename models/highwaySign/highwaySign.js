var mongoose = require('mongoose');

var highwaySignSchema = {
  signText: { type: String},   
  image:{ type: String},
  lat: {type: Number, required: true},
  lon: {type: Number, required: true},
  location: {type: String, required: true},
  image: { type: String},
};

module.exports = new mongoose.Schema(highwaySignSchema);
module.exports.highwaySignSchema = highwaySignSchema;

