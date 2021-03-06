// Majority of this code based on 
// https://github.com/jaredhanson/passport-github

// These functions are utilized in main-server.js

var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/userModel.js');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.github_id);
  });


  passport.deserializeUser(function(github_id, done) {
    User.queryByGitHubId(github_id, function(err, user) {
      if(user) {
        done(null, user);
      } else {
        done(err, null);
      }
    });
  });


// -------------------- GITHUB STRATEGY ---------------------


passport.use(new GitHubStrategy({

  // these should be put into a private file not displayed on github
  clientID : 'aeebe8219464e9582cc1',
  clientSecret : 'd17f30552c59f0b2c770578333082cc8349bef05',
  callbackURL : "http://127.0.0.1:3000/auth/github/callback",

  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification
    process.nextTick(function() {

      var github_id = profile.id;
      // find the user in database based on their id
      User.queryByGitHubId(github_id, function(err, user) {
        if(err) {
          return done(err);
        }

        if(user) {
          return done(null, user);
        } 
        // if no user exists in db, create a new one
        else {
          var newUser = {};

          newUser.github_id = profile.id;
          newUser.github_token = accessToken;
          newUser.username = profile.displayName;

          User.addGitHubUser(newUser, function(err, results) {
            if(err) {
              throw err;
            }
            return done(null, newUser);
          })
        }
      })
    })
  })

)};


