var assert = require('assert');
var express = require('express');
var fs = require('fs');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');
var tags = require('./TestAssets');
var uData = require('./TestUsers');
var mongodb = require('mongodb');

var tags = require('./TestAssets');

var uri = 'mongodb://localhost:27017/rfidServer';
var URL_ROOT = 'http://localhost:3000';

describe('Assets api',function()  {
  var server;
  var app;
  var db;
  var Asset;
  var Log;
  var User;

  it('can list all assets',function(done){
    superagent.get(URL_ROOT+'/assets')
    .end(function(err,res){
      if (err) {
        return done(err);
      }
      db.collection('assets').find({}).toArray(function(err,assets) {
        if (err)
          return done(err);
        else if(res.text.length==JSON.stringify(assets).length) {
          done();
        }
        else  {
          done("number of assets mismatch!!");
        }
      });
    });
  });

 it('can list all assets from a location',function(done){
    superagent.get(URL_ROOT+'/assets/Riverside')
    .end(function(err,res){
      if (err) {
        return done(err);
      }
     db.collection('assets').find({'data.location':'Riverside'}).toArray(function(err,assets) {
        if (err)
          return done(err);
        else if(res.text.length==JSON.stringify(assets).length) {
          done();
        }
        else  {
          done("number of assets mismatch!!");
        }
      });
    });
  });
    

  before(function() {
   app = express();
   models = require('../models/db.js')(wagner);
    var deps = wagner.invoke(function(Asset,Log,User) {
      return {
        Asset: Asset,
        Log:Log,
        User:User
      };
    });
    Asset = deps.Asset;
    Log = deps.Log;
    User = deps.User;
    
    Asset.remove({},function(error)  {
      if (error)
        assert.ifError(error);
        var fns = [];
        tags.Assets.forEach(function(tag){
          Asset.create(tag,function(err){
            if (err)
              callback(error);
          });
        });
        require('async').parallel(fns);
    });

    User.remove({},function(error)  {
      if (error)
        assert.ifError(error);
        var fns = [];
        uData.Users.forEach(function(user){
          User.create(user,function(err){
            if (err)
              callback(error);
          });
        });
        require('async').parallel(fns);
    });

    mongodb.MongoClient.connect(uri, function(error, conn) {
      if (error) {
        return done(error);
      }
      db = conn;
    });

    app.use(function(req, res, next) {
      User.findOne({}, function(error, user) {
        assert.ifError(error);
        req.user = user;
        next();
      });
    });

    app.use(require('../apis/asset_api')(wagner));
    server = app.listen(3000);
  });
  

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

});