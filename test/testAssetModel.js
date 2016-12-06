
var assert = require('assert');
var mongodb = require('mongodb');
var wagner = require('wagner-core');
var tags = require('./TestAssets');

var uri = 'mongodb://localhost:27017/rfidServer';

describe('Asset Model', function() {
  var db;
  var Asset;
  
  it('can insert an asset', function(done) {
    var doc = {
			"data":{"location":"Riverside","signText":"Stop","image":"13","lat":"30.635279","lon":"-96.4701"},
			"tag":{"epcVal":"0xe200210020005589137a0272"}
		};
    Asset.create(doc,function(error)  {
      assert.ifError(error);
      db.collection('assets').count({tag:{epcVal: doc.tag.epcVal}}, function(error, c) {
        assert.ifError(error);
        assert.equal(c, 1);
        done();
      });
    });
  });
  
  /*it('can find an asset from a given EPC Value', function(done) {
    var EPCVal = "0xe200210020005589137a0272";
    assetController.findWithEPC(EPCVal, function(error) {
      assert.ifError(error);
      db.collection('assets').count({tag:{epcVal: EPCVal}}, function(error, c) {
        assert.ifError(error);
        assert.equal(c, 1);
        done();
      });
    });
  });*/

  before(function(done) {
    models = require('../models/db.js')(wagner);
    var deps = wagner.invoke(function(Asset) {
      return {Asset: Asset};
    });

    Asset = deps.Asset;
    
    mongodb.MongoClient.connect(uri, function(error, conn) {
      if (error) {
        return done(error);
      }
      db = conn;
      db.collection('assets').remove({}, function(error) {
        if (error) {
          return done(error);
        }
        var fns = [];
        tags.Assets.forEach(function(tag) {
          fns.push(function(callback) {
            db.collection('assets').insert(tag, function(error, res){
              if (error)
                 callback(error);
              });
          });
        });
        require('async').parallel(fns, done);
        done();
      });
    });
  });

  after(function(done) {
      db.close(done);
    });
});
