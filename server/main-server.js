var express = require('express');
// var db = require('./db');
var expressWs = require('express-ws')(app);
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var oauthserver = require('oauth2-server');

var parser = require('body-parser');

var app = express();

<<<<<<< HEAD
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Set up OAuth2 for login */
app.oauth = oauthserver({
  model: {},
  grants: ['password'],
  debug: true
});

app.all('/oauth/token', app.oauth.grant());

module.exports.app = app;
=======
app.get('/', function(req, res, next){
  res.render('index.html');
});
>>>>>>> master

app.get('/', app.oauth.authorize(), function(req, res) {
  res.send()
})
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
