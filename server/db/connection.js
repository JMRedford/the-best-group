// connects to the postgres database
var pg = require('pg');
var pgData = {
      host: 'ec2-54-204-3-188.compute-1.amazonaws.com',
      database: 'd1j5k7isn6nt4c',
      user : 'nflppfgyraiozr',
      port : 5432,
      password : 'XFaUc5zMPqRLwXwpaAJvGQhKb6',
      ssl: true
    };
    
var db = new pg.Client(process.env.DATABASE_URL || pgData);
db.connect();
exports.db = db;
