var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

var expressWs = require('express-ws')(app);
app.use(express.static('../client'));


/* Route to handle websocket request */
// app.ws('/', function(sock, req) {
//   ws.on('message', function(msg) {
//     //handle a message from the client
//   });
// });


var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening on ', port);
});