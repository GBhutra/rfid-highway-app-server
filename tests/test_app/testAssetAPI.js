var assert = require('assert');
var express = require('express');
var fs = require('fs');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');
var tags = require('./TestAssets');
var uData = require('./TestUsers');
var mongodb = require('mongodb');
var jwt = require('express-jwt');


var tags = require('./TestAssets');

var uri = 'mongodb://localhost:27017/rfidServer';
var URL_ROOT = 'http://localhost:3000';

describe('API for Assets',function()  {
  var server;
  var app;
  var db;
  var Asset;
  var Log;
  var User;
  var models;
  var token;

  it('can list all assets',function(done){
    superagent.get(URL_ROOT+'/assets')
    .set('Authorization','Bearer ['+token+']')
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
 /*
  it('can create an asset',function(done){
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

  it('can update an asset',function(done){
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
   */ 
//before the test begin
  before(function(done) {
    app = express();
    require('../dependencies')(wagner);
    require('../../app/models/db.js')(wagner);
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

      console.log('TestAPI: SecretKey: '+Config.secretKey);
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

    //API for assets
    app.use('/assets', auth,require('../../app/api/asset_api')(wagner));
    server = app.listen(3000);

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
      token = JSON.parse(res.text).token;
      done();
    });
  });
  

  after(function(done) {
    // Shut the server down when we're done
    server.close();
    var fns = [];
    fns.push(function(callback) {
      db.close(callback);
    });
    fns.push(function(callback) {
      require('../../app/models/db.js').close("test Complete", callback);
    });
    require('async').parallel(fns, done);
  });

});