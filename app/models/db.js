var mongoose = require('mongoose');
var _ = require('underscore');
var dbURI = 'mongodb://heroku_jlcpq7qb:tfqnf0nih7k70tlpt3b4gemh0a@ds133358.mlab.com:33358/heroku_jlcpq7qb';
var gracefulShutdown;

// if (process.env.NODE_ENV === 'production') {
//   dbURI = process.env.MONGODB_URI;
// }


module.exports = function(wagner) {

  var config = wagner.invoke(function(Config) {return Config} );
  mongoose.connect(config.dbURI);

  wagner.factory('db', function() {
    return mongoose;
  });

  var Asset = mongoose.model('Asset',require('./asset'),'assets');
  var Log = mongoose.model('Log',require('./log'),'logs');
  var User = mongoose.model('User',require ('./user')(config));

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

  module.exports.close = gracefulShutdown;