var express = require('express');
var wagner = require('wagner-core');
var http = require('http');

//Read the configuration file
var config = require('../dependencies')(wagner);;

//Initialize the models
require('./models/db.js')(wagner, config);


var app = express();

app.get('/',function(req,res)  { res.send("Hello World ! This is the DashBoard"); })

var user = wagner.invoke(function(User) {return User} );
wagner.invoke(require('./api/authentication'), { app: app, User: user });

app.use('/',require('./api/asset_api')(wagner));

var port = process.env.PORT || config.PORT;
app.set('port', port);
app.listen(port);

console.log('Listening on port '+port);