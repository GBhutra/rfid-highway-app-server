var mongoose = require('mongoose');
var highwaySignLog = require('./highwaySign/highwaySignLog');
var tag = require('./tag.js');

var LogSchema = new mongoose.Schema({
  tag : tag.RFIDTagSchema,
  assetID : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Asset'},
});

mongoose.model('Log', LogSchema);