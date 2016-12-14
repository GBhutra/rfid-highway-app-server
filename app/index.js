var express = require('express');
var wagner = require('wagner-core');
var http = require('http');
var path = require('path');

//Read the configuration file
require('../dependencies')(wagner);

//Initialize the models
require('./models/db.js')(wagner);


var app = express();

app.get('/',function(req,res)  { res.send("Hello World ! This is the DashBoard"); })

var user = wagner.invoke(function(User) {return User} );
wagner.invoke(require('./authentication'), { app: app, User: user });

app.use('/',require('./api/asset_api')(wagner));

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, '../app_client', 'index.html'));
});
app.use(express.static(path.join(__dirname, '../public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
