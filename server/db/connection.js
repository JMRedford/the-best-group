// connects to the postgres database
var pg = require('pg');
var pgData = {
      host: 'ec2-107-20-220-251.compute-1.amazonaws.com',
      database: 'd748t6s12s7k40',
      user : 'lnjrunoeriehxh',
      port : 5432,
      password : 'vcUJT6ord7XXHvNKoHQ2zLlrjW',
      ssl: true
    };
    
var db = new pg.Client(process.env.DATABASE_URL || pgData);
db.connect();
exports.db = db;
