var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var gameState = require('./models/gameState.js');
var passportConfig = require('./config/passport.js')(passport);

var app = express();

// websockets require
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

// Using ejs for now to render multiple views
// does not render a template, just plain html files.
app.set('views', __dirname + '/../client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Initialize enemies, gameState.init also can be used
// to initialize static objects.
gameState.init();

// Runs tickTime every 100 milliseconds, think of this
// as the projector running.
setInterval(gameState.tickTime, 100);

// Routes for github OAuth and github callback
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

// Basic Routes
app.get('/login', function (req, res) {
  res.render('login.html', { user: req.user });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/', isLoggedIn, function (req, res) {
  res.render('index.html', { user: req.user });
});

// This response is activated by the button click in index.html,
// gameState.addPosAndIdToBuild places locations and sets unique id's
// for your goku character.
// gameState.build renders the canvas containing the game
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




app.listen(process.env.PORT || 3000);
console.log('Server listening on 3000');

// Used to check if a user is Authenticated with OAuth
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
