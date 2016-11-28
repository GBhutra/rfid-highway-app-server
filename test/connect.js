var mongodb = require('mongodb');
var uri = 'mongodb://localhost:27017/rfidServer';

module.exports = function(callback) {
  console.log("checkpoint -1");
  mongodb.MongoClient.connect(uri, callback);
};