var express = require('express');
// var db = require('./db');
var expressWs = require('express-ws')(app);
var http = require('http');
var path = require('path');

var parser = require('body-parser');

var app = express();

app.get('/', function(req, res, next){
  res.render('index.html');
});

/*
route to handle websocket request
*/
app.ws('/', function(sock, req) {
  ws.on('message', function(msg) {
    //handle a message from the client
  });
});

module.exports.app = app;

app.set("port", process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '../client')));

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
