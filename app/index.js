var express = require('express');
var wagner = require('wagner-core');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');

//Read the configuration file
require('../dependencies')(wagner);

//Initialize the models
require('./models/db.js')(wagner);

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

//After the models setup the authentication scheme using passport
wagner.invoke(require('./config/authentication'), { app: app });

//Give permissions to the public folder
app.use(express.static(path.join(__dirname, '../public/')));

//API for authentication and registration etc
app.use('/',require('./api/authentication_api')(wagner));

var auth = wagner.invoke(function(Config) {
  var A = jwt({
    secret: Config.secretKey,
    userProperty: 'payload'
  });
  return A;
} );

//API for dashBoard
app.use('/dashboard', auth,require('./api/dashboard_api')(wagner));

//API for assets
app.use('/assets', auth,require('./api/asset_api')(wagner));


//sending the default index.html
//app.use(function(req, res) {
//  res.sendFile(path.join(__dirname, '../public/app/','index.html'));
//});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


wagner.invoke(function(Config) {
    var port = process.env.PORT || Config.PORT;
    app.set('port', port);
    app.listen(port);
    console.log('Listening on port '+port);
} );
