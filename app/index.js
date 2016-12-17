var express = require('express');
var wagner = require('wagner-core');
var http = require('http');
var path = require('path');

//Read the configuration file
require('../dependencies')(wagner);

//Initialize the models
require('./models/db.js')(wagner);


var app = express();

var user = wagner.invoke(function(User) {return User} );
wagner.invoke(require('./authentication'), { app: app, User: user });

app.use('/assets/',require('./api/asset_api')(wagner));
app.use(express.static(path.join(__dirname, '../public/')));



wagner.invoke(function(Config) {
    var port = process.env.PORT || Config.PORT;
    app.set('port', port);
    app.listen(port);
    console.log('Listening on port '+port);
} );
