var mongoose = require('mongoose');
var _ = require('underscore');
var dbURI = 'mongodb://localhost:27017/rfidServer';
var gracefulShutdown;

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}


module.exports = function(wagner) {
  mongoose.connect(Config.dbURI);

  wagner.factory('db', function() {
    return mongoose;
  });

  var Asset = mongoose.model('Asset',require('./asset'),'assets');
  var Log = mongoose.model('Log',require('./log'),'logs');
  var User = mongoose.model('User',require ('./user')(Config));

  var models = {
    Asset:Asset,
    Log:Log,
    User:User
  }

  _.each(models,function(value,key)  {
    wagner.factory(key,function() {
      return value;
    });

    return models;
  });
};

  // CONNECTION EVENTS
  mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
  });
  mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
  });
  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
  });

  // CAPTURE APP TERMINATION / RESTART EVENTS
  // To be called when process is restarted or terminated
  gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
      console.log('Mongoose disconnected through ' + msg);
      callback();
    });
  };
  // For nodemon restarts
  process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
  // For app termination
  process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
      process.exit(0);
    });
  });
  // For Heroku app termination
  process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
      process.exit(0);
    });
  });