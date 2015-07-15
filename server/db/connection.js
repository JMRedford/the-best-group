var pg = require('pg');
var conString = "localhost:3000";

var client = new pg.Client(conString);
client.connect(conString, function(err, client, done) {

  if(err) {
    return console.error('error fetching client from pool', err);
  }
});

module.exports = client