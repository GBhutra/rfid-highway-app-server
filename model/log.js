var mongoose = require('mongoose');
var LogData = require('./highwaySign/highwaySignLog');
var Tracker = require('./tracker');

var LogSchema = new mongoose.Schema({
  tag : Tracker.RFIDTagSchema,
  logData : LogData.highwaySignLogSchema
});

mongoose.model('Log', LogSchema);