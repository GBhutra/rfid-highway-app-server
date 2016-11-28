var assert = require('assert');
var mongoose = require('mongoose');
require ('../model/db');
var mon = require('./connect');
var assetController = require('../controller/assetController');
var tags = require('./TestAssets');

/**
 *  This test suite is meant to be run through gulp (use the `npm run watch`) script. 
 */
describe('assetController', function() {
  console.log("checkpoint 1");
  var db;
  
  /**
   *  This test ensures that the assetController can insert new asset
   */
  it('can insert a asset', function(done) {
    var doc = {epcVal:"12350", signText:"YIELD", location:"MAIN CAMPUS"};
    assetController.create(db, doc, function(error) {
      assert.ifError(error);
      db.collection('assets').count({ epcVal: doc.epcVal }, function(error, c) {
        assert.ifError(error);
        assert.equal(c, 1);
        done();
      });
    });
  });

  before(function(done) {
    console.log("Reaching here");
    connect(function(error, conn) {
      if (error) {
        return done(error);
      }
      db = conn;
      db.collection('assets').remove({}, function(error) {
        if (error) {
          return done(error);
        }
        var fns = [];
        tags.Tags.forEach(function(tag) {
          fns.push(function(callback) {
            assetController.insert(db, tag, callback);
          });
        });
        require('async').parallel(fns, done);
      });
    });
  });

  after(function(done) {
      db.close(done);
    });
});
