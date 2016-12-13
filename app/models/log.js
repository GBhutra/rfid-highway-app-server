var mongoose = require('mongoose');
var LogData = require('./highwaySign/highwaySignLog');
var Tracker = require('./tracker');

var LogSchema = {
  tag : Tracker.RFIDTagSchema,
  logData : LogData.highwaySignLogSchema
};

module.exports = new mongoose.Schema(LogSchema);
module.exports.LogSchema = LogSchema;