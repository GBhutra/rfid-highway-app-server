function setupAuth(User, app, Config) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    
  // High level serialize/de-serialize configuration for passport
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }));

  // Express middlewares
  app.use(require('express-session')({
    secret: Config.secretKey
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Express routes for auth
  app.get('/auth', function(req,res)    {
      passport.authenticate('local', function(err, user, info)  {
      var token;
      // If Passport throws/catches an error
      if (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
      }
      // If a user is found
      if(user){
        token = user.generateJwt();
            res.status(200);
            res.json({"token" : token});
        } else {
            return res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });    
        }       
  });
});


  app.get('/',
    passport.authenticate('local', { failureRedirect: '/fail' }),
    function(req, res) {
      res.send('Welcome, ' + req.user);
    });
}

module.exports = setupAuth;