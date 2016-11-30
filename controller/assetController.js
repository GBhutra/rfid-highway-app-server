require('../model/db.js');
var mongoose = require('mongoose');
var Asset = mongoose.model('Asset');

exports.create = function(asset, callback) {
    var a = new Asset();
    a.data = asset.data;
    a.tag = asset.tag;
    a.save(function(err)  {
      callback(err);
    });
};

exports.findWithEPC=function(EPC,callback)  {
  Asset.findOne({tag:EPC}).exec(callback);
}

/*
 *  Finds all documents in the "movies" collection
 *  whose "director" field equals the given director,
 *  ordered by the movie's "title" field. See
 *  http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#sort
 
exports.byDirector = function(db, director, callback) {
  // TODO: implement
  db.collection('movies').find({director : director}).sort({'title': 1}).toArray(function(err, docs) {
    callback(err,docs);
  });
};
*/