require('../model/db.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.create = function(user, callback) {
  if(!user.email || !user.name || user.password)  {
    callback("Need all the fields to create a new User");
  }
  else  {
    var u = new User();
    u.name = user.name;
    u.email = user.email;
    u.setPassword(user.password);
  
    u.save(function(err) {
      if (err)
        callback(err);
      else  {
        var token;
        token = user.generateJwt();
        callback(token.json);
      }
    });
  }
};

/*
module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
*/