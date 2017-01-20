var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var passport = require('passport');
var jwt = require('express-jwt');


module.exports = function(wagner) {
  var authRouter = express.Router();
  authRouter.use(bodyparser.json());

  authRouter.post('/login', wagner.invoke(function(User) {
    return function(req,res)  {
      if(!req.body.email || !req.body.password) {
         return res.status(status.BAD_REQUEST).json({ 'message':" Need all fields !" });
      }
      else {
        passport.authenticate('local', function(err, user, info){
          var token;
          // If Passport throws/catches an error
          if (err) {
            return res.status(status.INTERNAL_SERVER_ERROR).json({ err: error.toString() });
          }
          // If a user is found
          if(user){
            token = user.generateJwt();
            res.status(status.OK);
            res.json({
              "token" : token
            });
          } else {
            // If user is not found
            return res.status(status.UNAUTHORIZED).json({ 'message': "User Not Found !" });
          }
        })(req, res);
      }
    }
  }));

  authRouter.post('/register', wagner.invoke(function(User) {
    return function(req,res)  {
      var user = new User();

      user.name = req.body.name;
      user.email = req.body.email;

      user.setPassword(req.body.password);

      user.save(function(err) {
        var token;
        token = user.generateJwt();
        res.status(status.OK);
        res.json({
          "token" : token
        });
      });
    }
  }));

  return authRouter;
};
