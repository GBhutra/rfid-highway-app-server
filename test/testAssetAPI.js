var assert = require('assert');
var express = require('express');
var fs = require('fs');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');
var tags = require('./TestAssets');

var URL_ROOT = 'http://localhost:3000';

describe('Assets',function()  {
  var server;
  var app;
  var Asset;
  var Log;

  it('can create an asset',function(done){
    
  });

  before(function() {
    app = express();
   models = require('../models/db.js')(wagner);
    var deps = wagner.invoke(function(Asset,Log) {
      return {
        Asset: Asset,
        Log:Log
      };
    });
    Asset = deps.Asset;
    Log = deps.Log;
    
    Asset.remove({},function(error)  {
      if (error)
        return done(error);
        var fns = [];
        tags.Assets.forEach(function(tag){
          Asset.create(tag,function(err){
            if (err)
              callback(error);
          });
        });
        require('async').parallel(fns,done);
    });

    app.use(function(req, res, next) {
      User.findOne({}, function(error, user) {
        assert.ifError(error);
        req.user = user;
        next();
      });
    });

    app.use(require('./api')(wagner));
    server = app.listen(3000);
    done();
  });
});