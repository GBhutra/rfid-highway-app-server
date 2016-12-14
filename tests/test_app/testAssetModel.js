
var assert = require('assert');
var mongodb = require('mongodb');
var wagner = require('wagner-core');
var tags = require('./TestAssets');

var uri = 'mongodb://localhost:27017/rfidServer';

describe('Asset Model', function() {
  var db;
  var Asset;
  var models;
  
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

  it('can find an asset using EPCVal', function(done) {
    var doc = {
			"data":{"location":"Riverside","signText":"Stop","image":"13","lat":"30.635279","lon":"-96.4701"},
			"tag":{"epcVal":"0xe200210020115589137a0272"}
		};
    db.collection('assets').insertOne(doc,function(err,r)  {
      assert.ifError(err);
      Asset.findOne({tag:doc.tag},function(error,row) {
        assert.ifError(error);
        assert.equal("0xe200210020115589137a0272",row.tag.epcVal);
        done();
      });
    });
  });

  it('can find assets using metadata like location', function(done) {
    //All the test data used have location 'Riverside' so the count of all the assets should be the same as the result from find
    Asset.find({'data.location':"Riverside"},function(error,signs) {
      db.collection('assets').find({'data.location':"Riverside"}).toArray(function(err,c){
        assert.ifError(err);
        assert.equal(c.length,signs.length);
        done();
      });
    });
  });

  it('can update metadata like location', function(done) {
    var doc = {
			"tag":{"epcVal":"0xe200210020115589137a0272"}
		};
    Asset.findOne({tag:{epcVal: doc.tag.epcVal}},function(error,sign) {
      assert.ifError(error);
      sign.data.location = "Not Riverside";
      sign.save(function(err){
         assert.ifError(err);
         db.collection('assets').findOne({tag:{epcVal: doc.tag.epcVal}},function(er,c){
            assert.ifError(err);
            assert.equal(c.data.location,'Not Riverside');
            done();
         });
      });
    });
  });
  

  before(function(done) {
    require('../dependencies')(wagner);
    models = require('../../app/models/db.js');
    models(wagner);
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
    var fns = [];
    fns.push(function(callback) {
      db.close(callback);
    });
    fns.push(function(callback) {
      models.close("test Complete", callback);
    });
    require('async').parallel(fns, done);
  });
});
