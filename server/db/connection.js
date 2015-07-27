// connects to the postgres database
var pg = require('pg');
var connectionString = "postgres://nflppfgyraiozr:XFaUc5zMPqRLwXwpaAJvGQhKb6@ec2-54-204-3-188.compute-1.amazonaws.com:5432/d1j5k7isn6nt4c"
var db = new pg.Client(connectionString);
db.connect();
exports.db = db;