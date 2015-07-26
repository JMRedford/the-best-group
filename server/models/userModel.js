var db = require('../db/connection.js').db;

// Utility database functions

exports.getAllUsers = function(cb) {
  var queryStr = "SELECT * FROM users;";
  db.query(queryStr, function(err, results) {
    if(err) {
      console.log("Error in querying all users");
    } else {
      cb(null, results.rows);
    }
  });
}

exports.queryByGitHubId = function(id, cb) {
  var queryStr = "SELECT * FROM users WHERE github_id = "
                 + "'" + id + "';";
  db.query(queryStr, function(err, results) {
    if(err) {
      console.log("we have an error");
      cb(err, null);
    } else {
      cb(null, results.rows[0]);
    }
  })
}

exports.addGitHubUser = function(user, cb) {
  var queryStr = "INSERT INTO users (github_id, github_token, username) VALUES ("
                 + "'" + user.github_id + "', "
                 + "'" + user.github_token + "', "
                 + "'" + user.username + "') RETURNING user_id;";

  db.query(queryStr, function(err, results) {
    if(err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}