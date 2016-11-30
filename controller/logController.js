require('../model/db.js');
var mongoose = require('mongoose');
var Log = mongoose.model('Log');

exports.create = function(log, callback) {
  if(!log.assetID || !log.tag )  {
    callback("Need all the fields to create a new Log");
  }
  var l = new Log();
  l.assetID = log.assetID;
  l.tag = log.tag;
  l.save(function(err)  {
    callback(err);
  });
};