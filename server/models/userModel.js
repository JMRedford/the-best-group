var db = require('../db/connection.js');

// Utility database functions

exports.getAllUsers = function(cb) {
  var queryStr = "SELECT * FROM Users;";
  db.query(queryStr, function(err, results) {
    if(err) {
      console.log("Error in querying all users");
    } else {
      cb(null, results.rows);
    }
  });
}

// If we ever wanted to add generic login alongside OAuth

// exports.addUser = function(user, cb) {
//   var queryStr = "INSERT INTO Users (username, password) VALUES ("
//                  + "'" + user.username + "', "
//                  + "'" + user.password + "') RETURNING id;";
  
//   db.query(queryStr, function(err, results) {
//     if(err) {
//       console.log("Error inserting a user");
//     } else {
//       cb(null, results.rows[0]);
//     }
//   });
// }

exports.addGitHubUser = function(user, cb) {
  var queryStr = "INSERT INTO Users (github_id, github_token, username) VALUES ("
                 + "'" + user.github_id + "', "
                 + "'" + user.github_token + "', "
                 + "'" + user.username + "') RETURNING id;";

  db.query(queryStr, function(err, results) {
    if(err) {
      console.log("Error inserting a github user");
    } else {
      cb(null, results);
    }
  });
}