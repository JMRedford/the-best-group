var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var gameState = require('./models/gameState.js');

var app = express();

var expressWs = require('express-ws')(app);
app.use(express.static(__dirname + '/../client'));

var playerKey = 0;
//set up an options object that will contain
// enemy amts and static object amts
gameState.init();

setInterval(gameState.tickTime, 30);

app.get('/', function(req, res) {
  res.render('index.html');
})

app.get('/start', function(req, res) {
  res.json(gameState.build);
});

/* Route to handle websocket request */
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    var data = JSON.parse(msg)
    gameState.message(data.loc)
  });
  setInterval(function(){
    gameState.sendGameStateToPlayer(ws);
  }, 30)
});

app.listen(process.env.PORT || 3000);
console.log('Server listening on 3000')
