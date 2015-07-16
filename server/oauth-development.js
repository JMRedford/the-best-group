var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var oauthserver = require('oauth2-server');

var app = express();
var expressWs = require('express-ws')(app);

app.use(express.static('../client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



/* Set up OAuth2 for login */
app.oauth = oauthserver({
  model: {},
  grants: ['password'],
  debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorize(), function(req, res) {
  res.send()
});



/* Route to handle websocket request */
app.ws('/', function(sock, req) {
  ws.on('message', function(msg) {
    //handle a message from the client
  });
});



/*  Start up the server */
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening on ', port);
});

module.exports.app = app;

