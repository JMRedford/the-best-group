// connects to the postgres database
var pg = require('pg');

var db = new pg.Client();
db.connect();

exports.db = db;