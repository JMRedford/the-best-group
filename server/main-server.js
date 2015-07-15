var express = require('express');
// var db = require('./db');
var http = require('http');
var path = require('path');

var parser = require('body-parser');

var app = express();
module.exports.app = app;


/*
route to handle websocket request
*/
app.ws('/', function(sock, req) {
  ws.on('message', function(msg) {
    //handle a message from the client
  });
});

app.set("port", process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '../client')));

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
