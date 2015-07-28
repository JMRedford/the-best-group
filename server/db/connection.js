// connects to the postgres database
var pg = require('pg');
var pgData = {
      host: '',
      database: '',
      user : '',
      port : ,
      password : '',
      ssl: true
    };
var db = new pg.Client(process.env.DATABASE_URL || pgData);
db.connect();
exports.db = db;
