var assert = require('assert');
var express = require('express');
var fs = require('fs');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');
var tags = require('./TestAssets');

var URL_ROOT = 'http://localhost:3000';

describe('Assets api',function()  {
  var server;
  var app;
  var Asset;
  var Log;
  var User;

  it('can list all assets',function(done){
    User.findOne({email:"admin@example.com"},function(error,user) {
      assert.ifError(error);
      superagent.get(URL_ROOT+'/assets')
      .end(function(err,res){
        if (err) {
          return done(err);
        }
        var assets = res.text;
        Asset.find({},function(er,assets) {
          if (er)
            return done(err);
          else if(res.text==JSON.stringify(assets))
            done();
          else  {
            done("Assets mismatch!!");
          }
        });
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