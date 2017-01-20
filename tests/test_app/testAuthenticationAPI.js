var assert = require('assert');
var express = require('express');
var fs = require('fs');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');
var uData = require('./TestUsers');
var mongodb = require('mongodb');
var jwt = require('express-jwt');


var tags = require('./TestAssets');

var uri = 'mongodb://localhost:27017/rfidServer';
var URL_ROOT = 'http://localhost:3000';

describe('Assets api',function()  {
  var server;
  var app;
  var db;
  var User;
  var models;

  it('can login a user',function(done){
    superagent.post(URL_ROOT+'/login')
    .set('Content-Type','application/json')
    .send({
      "email": "admin@example.com",
			"password":"password"
    })
    .end(function(err,res){
      if (err) {
        return done(err);
      }
      var token = JSON.parse(res.text);
      assert.notEqual(res.text.token,null);
      done();
    });
  });
/*
  it('can register a new user',function(done){
    superagent.post(URL_ROOT+'/assets/asset')
    .set('Content-Type','application/json')
    .send({
      "data":{"location":"Riverside","signText":"Street: Bryan Rd","image":"3","lat":"30.638921","lon":"-96.4678"},
			"tag":{"epcVal":"0xe20021002000531114712342"}
    })
    .end(function(err,res){
      if (err) {
        return done(err);
      }
      assert.equal(res.body,"New Asset Created with epcVal: 0xe20021002000531114712342");
      done();
    });
  });

  it('does not allow a non-user to access',function(done){
    superagent.put(URL_ROOT+'/assets/asset/')
    .query({epcVal:"0xe20021002000531114712342"})
    .set('Content-Type','application/json')
    .send({
      "data":{"location":"Not Riverside","signText":"Street: Bryan Rd","image":"3","lat":"30.638921","lon":"-96.4678"},
			"tag":{"epcVal":"0xe20021002000531114712342"}
    })
    .end(function(err,res){
      if (err) {
        return done(err);
      }
      db.collection('assets').findOne({tag:{epcVal: doc.tag.epcVal}}, function(error,asset) {
        assert.ifError(error);
        assert.equal(asset.data.location,"Not Riverside");
        done();
      });
    });
  });
  */
//before the test begin
  before(function() {
    app = express();
    require('../dependencies')(wagner);
    models=require('../../app/models/db.js');
    models(wagner);
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

    wagner.invoke(require('../../app/config/authentication'), { app: app });

    //API for authentication
    app.use('/', require('../../app/api/authentication_api')(wagner));

    //API for authentication and registration etc
    var auth = wagner.invoke(function(Config) {
      var A = jwt({
        secret: Config.secretKey,
        userProperty: 'payload'
      });
      return A;
    } );

    var doc = {
			"name" : "Admin RFIDLab",
      "email": "admin@example.com",
      "password":"password"
		};
    var user = new User();
    user.name = doc.name;
    user.email = doc.email;
    user.setPassword(doc.password);
    user.save(function(error)  {
      assert.ifError(error);
      db.collection('users').count({name:"Admin RFIDLab"}, function(error, c) {
      });
    });

    server = app.listen(3000);
  });
  

  after(function(done) {
    // Shut the server down when we're done
    server.close();
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