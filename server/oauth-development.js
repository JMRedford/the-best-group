var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');


var gameState = require('./models/gameState.js');

var passportConfig = require('./config/passport.js')(passport);

var app = express();

var expressWs = require('express-ws')(app);

app.use(session({
  secret: 'itsOver9000',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());

app.set('views', __dirname + '/../client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/auth/github', 
  passport.authenticate('github'),
  function(req, res){
    console.log("I've been clicked!")
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successfull authentication, redirect home.
    res.redirect('/');
  });

// Setup views for account and login
app.get('/login', function (req, res) {
  res.render('login.html', { user: req.user });
});



//set up an options object that will contain
// enemy amts and static object amts
gameState.init();

setInterval(gameState.tickTime, 30);

app.get('/', function (req, res) {
  res.render('index.html', { user: req.user });
});

app.get('/start', function(req, res) {
  gameState.addPosAndIdToBuild();
  res.json(gameState.build);
});

/* Route to handle websocket request */
app.ws('/', function (ws, req) {
  gameState.addPlayer(ws);
  ws.on('message', function(msg) {
    var data = JSON.parse(msg);
    gameState.handleMessage(data);
  });
});


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}


app.listen(process.env.PORT || 3000);
console.log('Server listening on 3000');
