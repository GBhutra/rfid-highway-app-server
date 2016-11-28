var mongoose = require('mongoose');
var highwaySignLog = require('./highwaySign/highwaySignLog');
var tag = require('./tag.js');

var LogSchema = new mongoose.Schema({
  tag : tag.RFIDTagSchema
});

mongoose.model('Log', LogSchema);