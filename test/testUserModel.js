
var assert = require('assert');
var mongodb = require('mongodb');
var wagner = require('wagner-core');
var tData = require('./TestUsers');

var uri = 'mongodb://localhost:27017/rfidServer';

describe('User Model', function() {
  var db;
  var User;
  
  it('can create a user', function(done) {
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
        assert.ifError(error);
        assert.equal(c, 1);
        done();
      });
    });
  });

  it('can remove a user using email address', function(done) {
    var doc = {
			"name" : "Admin1 RFIDLab",
      "email": "admin@example1.com",
      "password":"password"
		};
    var user = new User();
    user.name = doc.name;
    user.email = doc.email;
    user.setPassword(doc.password);
    user.save(function(error)  {
      assert.ifError(error);
      User.remove({email:"admin@example1.com"},function(err) {
        assert.ifError(err);
        db.collection('assets').count({email:"admin@example1.com"}, function(errr, c) {
          assert.ifError(errr);
          assert.equal(c,0);
          done();
        });
      });
    });
  });

  it('can authenticate a user using email and password', function(done) {
     var doc = {
      "email": "admin@example.com",
      "password":"password"
		};
    User.findOne({email:doc.email},function(err,user){
      assert.ifError(err);
      if(user)  {
        done(!user.validPassword(doc.password));
      }
      else
        done("No user with the email address "+doc.email);
    });
  });

  it('can update the name and password for a user', function(done) {
    var doc = {
      "email": "admin@example.com",
      "name": "NewName",
      "password":"password123"
    };
    User.findOne({email:doc.email},function(err,user){
      assert.ifError(err);
      if(user)  {
        user.name = doc.name;
        user.setPassword(doc.password);
        user.save(function(error)  {
          assert.ifError(error);
          db.collection('users').count({name:"NewName"}, function(error, c) {
            assert.ifError(error);
            assert.equal(c, 1);
            done();
          });
        });
      }
      else
        done("No user with the email address "+doc.email);
    });
  });


  before(function(done) {
    models = require('../models/db.js')(wagner);
    var deps = wagner.invoke(function(User) {
      return {User: User};
    });
    User = deps.User;
    mongodb.MongoClient.connect(uri, function(error, conn) {
      if (error) {
        return done(error);
      }
      db = conn;
      db.collection('users').remove({}, function(error) {
        if (error) {
          return done(error);
        }
        var fns = [];
        tData.Users.forEach(function(user) {
          fns.push(function(callback) {
            db.collection('users').insert(user, function(error, res){
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
