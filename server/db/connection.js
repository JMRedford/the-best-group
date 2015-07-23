var pg = require('pg');
var conString = "localhost:3000";

// think about removing conString, may be unnecessary
var db = new pg.Client(conString);
db.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
});

module.exports = db;