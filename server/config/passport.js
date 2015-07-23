var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/userModel.js');

module.exports = function(passport) {

  passport.serialize(function(user, done) {
    done(null, user.github_id);
  });

  // need to query the database and find the user
  //  based on their github id.  will work on a query
  //  file.
  passport.deserialize(function(obj, done) {
    done(null, obj)
};
  // need to add a callbackURL 

passport.use(new GitHubStrategy({

  clientID : GITHUB_CLIENT_ID,
  clientSecret : GITHUB_CLIENT_SECRET,
  callbackURL : "http://127.0.0.1:3000/auth/github/callback"

  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification
    process.nextTick(function() {

      // need to utilize db querying to add the username

      return done(null, profile);

    });
  }
}))