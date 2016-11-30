var mongoose = require('mongoose');
var highwaySign = require('./highwaySign/highwaySign');
var tracker = require('./tracker.js');

var assetSchema = new mongoose.Schema({
  data : highwaySign.highwaySignSchema,
  tag : tracker.RFIDTagSchema
});

mongoose.model('Asset', assetSchema);