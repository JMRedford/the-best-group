var db = require('../db/connection.js');

module.exports = {
  users: {
    get: function(req, res) {
      db.query("SELECT * FROM Users", function(err, data) {
        if(err) {
          console.log('Query failed');
        } else {
          console.log('Query successful');
          res.end(JSON.stringify(data));
        }
      });
    },
    post: function(req, res) {
      db.query("SELECT INTO Users (username) VALUES ('test user')", function(err, data) {
        if(err) {
          console.log('Insert failed');
        } else {
          console.log('Insert successful');
        }
      })
    }
  }
}
