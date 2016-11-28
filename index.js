var db = require('./model/db.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var user = new User();
user.name = "Ghanshyam Bhutra";
user.email = "something@ex.com";
user.setPassword("password");

user.save(function(err) {
    var token=user.generateJwt();
    console.log("User registered !! token: "+token);
});
