var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var gameState = require('./models/gameState.js');

var app = express();

var expressWs = require('express-ws')(app);
app.use(express.static('../client'));

gameState.init();
setInterval(gameState.tickTime, 30);


/* Route to handle websocket request */
app.ws('/', function(connection, req) {
  ws.on('message', function(msg) {
    gameState.message(msg.data.id, msg.data.loc)
  });
  setInterval(function(){
    gameState.sendGameStateToPlayer(connection);
  },30)
});


var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening on ', port);
});

