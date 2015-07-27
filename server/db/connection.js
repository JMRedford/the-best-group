// connects to the postgres database
var pg = require('pg');

var db = new pg.Client();
db.connect(process.env.DATABASE_URL);

exports.db = db;