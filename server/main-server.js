var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var gameState = require('./models/gameState.js');

var app = express();

var expressWs = require('express-ws')(app);
app.use(express.static(__dirname + '/../client'));

//set up an options object that will contain
// enemy amts and static object amts
gameState.init();

setInterval(gameState.tickTime, 30);

// The intial static page seen by player
app.get('/', function(req, res) {
  res.render('index.html');
});

// The response to this request conatins all the necessary information for
// the client to build a gameboard after which client establishes websocket connection
app.get('/start', function(req, res) {
  gameState.addPosAndIdToBuild();
  res.json(gameState.build);
});

/* Route to handle websocket request from client on game init */
app.ws('/', function(ws, req) {
  gameState.addPlayer(ws);
  ws.on('message', function(msg) {
    var data = JSON.parse(msg);
    gameState.handleMessage(data);
  });
});

app.listen(process.env.PORT || 3000);
console.log('Server listening on 3000');
