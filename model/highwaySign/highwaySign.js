var mongoose = require('mongoose');

var highwaySignSchema = {
    signText: {type: String },
    location: {type: String }
  //signText: { type: String, required: true},
  //signType: {type: String, required: true},
  //latitude: {type: Number, required: true},
  //longitude: {type: Number, required: true},
  //group: {type: String, required: true},
  //image: { type: String, match: /^http:\/\//i },
  //address: {type: String},
  //dateAdded: {type: Date},
};

module.exports = new mongoose.Schema(highwaySignSchema);
module.exports.highwaySignSchema = highwaySignSchema;

