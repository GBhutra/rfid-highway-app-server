var express = require('express');
var wagner = require('wagner-core');
require('./models/db.js')(wagner);
//require('./dependencies')(wagner);

var app = express();
app.get('/',function(req,res)  { res.send("Hello World ! This is the DashBoard"); })
var user = wagner.invoke(function(User) {return User} );
wagner.invoke(require('./apis/authentication'), { app: app, User: user });

app.use('/',require('./apis/asset_api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');