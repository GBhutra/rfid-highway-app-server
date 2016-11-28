var mongoose = require('mongoose');
var highwaySign = require('./highwaySign/highwaySign');
var tag = require('./tag.js');

var assetSchema = new mongoose.Schema({
  data : highwaySign.highwaySignSchema,
  tag : tag.RFIDTagSchema
});

mongoose.model('Asset', assetSchema);