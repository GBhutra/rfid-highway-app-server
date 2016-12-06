var mongoose = require('mongoose');
var highwaySign = require('./highwaySign/highwaySign');
var tracker = require('./tracker.js');
var wagner = require('wagner-core');

var assetSchema = {
  data : highwaySign.highwaySignSchema,
  tag : tracker.RFIDTagSchema
};

module.exports = new mongoose.Schema(assetSchema);
module.exports.assetSchema = assetSchema;
