var express = require('express');
var wagner = require('wagner-core');

var config = require('../dependencies')(wagner);

//Initialize the models
wagner.invoke(require('./models/db.js')(wagner));


var app = express();

app.get('/',function(req,res)  { res.send("Hello World ! This is the DashBoard"); })

var user = wagner.invoke(function(User) {return User} );
wagner.invoke(require('./api/authentication'), { app: app, User: user });

app.use('/',require('./api/asset_api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');