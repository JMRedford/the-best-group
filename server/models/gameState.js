// This is the main file that tracks the game state, including positions 
// of all projectiles, enemies, and players
var utils = require('./utils.js');
var gameBoard = require('./randomBoard.js');

var exports = module.exports = {};

//server side game state storage here
var players = [];
//player: {'pId':#, 'conn':conn, 'loc':[#,#]}

var enemies = [];
//enemy: {'loc':[#,#], delta:[#,#]}

var staticObjects = [];
// trees, rocks, etc initialized with loc coords
// format: [{'loc':[x,y]},...]

var playerShots = [];
//format of playerAttack: {loc: [origin x, origin y],
//        or enemyAttack:  delta: [dx, dy],
//                         time : timestamp (milisecs%1000000)}
var enemyShots = [];

var playerIdIncrementer = 0;
// build out an options that sets
//   enemyAmt, staticObjAmt, maxX, maxY, shotSpeed

// ------------------------------------ OPTIONS ----------------------------------------
// Options regarding board size, projectile speed, etc...
var options = {
  enemyAmt: 10,
  playerMaxHealth: 10,
  staticObjAmt: 6,
  maxX: 50,
  maxY: 50,
  playerShotSpeed: 0.008,
  enemyRespawnTimeMin: 1000,
  enemyRespawnTimeMax: 5000
};

// -------------------------------- ON SERVER LOAD ------------------------------------
// Runs right after server runs
exports.init = function(){
  //create static objects
  // for (var j = 0; j < options.staticObjAmt; j++) {
  //   exports.addStaticObject();
  // }

  // create enemies
  for (var i = 0; i < options.enemyAmt; i++) {
    addEnemy();
  }
};

// Handles the data sent by clients regarding current pos and shots fired
exports.handleMessage = function(data){
  // Update location
  for (var i = 0; i < players.length; i++) {
    if(players[i].pId === data.pId) {
      players[i].loc = data.loc;
    }
  }

  // Store fireballs in necessary format
  var time = Date.now()%1000000;
  for (var i = 0; i < data.nfb.length; i++) {
    var dirs = {'up'       : [0,-options.playerShotSpeed], 
                'down'     : [0, options.playerShotSpeed], 
                'left'     : [-options.playerShotSpeed,0], 
                'right'    : [ options.playerShotSpeed,0],
                'upleft'   : [-options.playerShotSpeed,-options.playerShotSpeed],
                'upright'  : [ options.playerShotSpeed,-options.playerShotSpeed],
                'downleft' : [-options.playerShotSpeed, options.playerShotSpeed],
                'downright': [ options.playerShotSpeed, options.playerShotSpeed]};
    var shot = data.nfb[i];
    if (dirs[shot.dir] !== undefined) {
      playerShots.push({'loc'   : shot.loc,
                                'delta' : dirs[shot.dir],
                                'time'  : time});
    } else {
      console.log('Invalid fireball direction recieved from client: ' + data.pId);
    }
  }
};

exports.addPlayer = function(ws){
  var newPlayer = {};
  newPlayer.hit = false;
  newPlayer.conn = ws;
  newPlayer.pId = exports.build.pId;
  newPlayer.loc = [exports.build.playerStartX, exports.build.playerStartY];
  players.push(newPlayer);
  newPlayer.health = options.playerMaxHealth;
};

// This is the main function which advances the game state one 'tick'
exports.tickTime = function(){
  //move enemies around and check for collisions
  for (var i = 0; i < enemies.length; i++){
    utils.randomWalk(enemies[i], options);
    if (Math.random() < 0.02){
      //make an enemy shot
      var newShot = {};
      newShot.loc = enemies[i].loc;
      newShot.delta = [enemies[i].delta[0]/10,enemies[i].delta[1]/10];
      newShot.time = Date.now()%1000000;
      enemyShots.push(newShot);
    }
  }

  var playerShotsToRemove = [];
  var enemiesToRemove = [];
  // Note everything that has collided
  for (var i = 0; i < playerShots.length; i++){
    var shot = {loc : utils.vectorTransform(playerShots[i])};
    if (shot.loc[0] > options.maxX || shot.loc[0] < 0 || shot.loc[1] < 0 || shot.loc[1] > options.maxY){
      playerShotsToRemove.push(i);
    }

    for (var j = 0; j < staticObjects.length; j++){
      if (utils.checkCollisions(shot, staticObjects[j])){
        playerShotsToRemove.push(i);
      }
    }
    for (var j = 0; j < enemies.length; j++) {
      if (utils.checkCollisions(shot, enemies[j])){
        playerShotsToRemove.push(i);
        enemiesToRemove.push(j);
      }
    }
  }

  // Set timeouts to spawn new enemies
  for (var i = 0; i < enemiesToRemove.length; i++) {
    setTimeout(addEnemy, 
      (Math.random() * options.enemyRespawnTimeMax) + options.enemyRespawnTimeMin);
  }

  // And remove struck enemies
  enemiesToRemove.sort(function(a,b){ return a - b; });
  for (var i = enemiesToRemove.length - 1; i >= 0; i--){
    enemies.splice(enemiesToRemove[i],1);
  }
  for (var i = playerShotsToRemove.length - 1; i >= 0; i--){
    playerShots.splice(playerShotsToRemove[i],1);
  }
  var enemyShotsToRemove = [];
  for (var i = 0; i < enemyShots.length; i++) {
    var shotLoc = utils.vectorTransform(enemyShots[i]);
    if (shotLoc[0] > options.maxX || shotLoc[1] > options.maxY || shotLoc[0] < 1 || shotLoc[1] < 1){
      enemyShotsToRemove.push(i);
    }
  }
  for (var i = enemyShotsToRemove.length - 1; i >= 0; i--){
    enemyShots.splice(i,1);
  }

  var playersToRemove = [];
  for (var i = 0; i < players.length; i++){
    if (players[i].hit && players[i].hitTime < Date.now() - 500){
      players[i].hit = false;
    }
    for (var j = 0; j < enemyShots.length; j++){
      var shot = {loc: utils.vectorTransform(enemyShots[j])}
      if (players[i].loc){
        if (utils.checkCollisions(players[i],shot) && !players[i].hit){
          players[i].health--;
          players[i].hit = true;
          players[i].hitTime = Date.now();
          if (players[i].health <= 0){
            playersToRemove.push(i);
          }
        }
      }
    }
  }
  for (var i = playersToRemove.length - 1; i >= 0; i--){
    players[playersToRemove[i]].conn.send(JSON.stringify({gameLost:true}));
    players.splice(playersToRemove[i],1);
  }

  // loop through the players
  //  send data to player through their connections
  for (var i = players.length - 1; i >= 0; i--){
    try {

      exports.sendGameStateToPlayer(players[i]);
    } catch (err){
      //remove player from array
      players.splice(i,1);
    }
  }
};


// Builds and sends data to send to clients
exports.sendGameStateToPlayer = function(player) {
  playerLoc = player.loc;
  connection = player.conn;

  var playerData = [];
  var enemyData = [];
  var playerShotsData = [];
  var enemyShotsData = [];


  var data = {};

  // player locations
  for (var i = 0; i < players.length; i++) {
    if (utils.onScreen(playerLoc, players[i].loc)) {
      playerData.push([players[i].pId , players[i].loc]);
    }
  }

  // enemy locations
  for (var i = 0; i < enemies.length; i++) {
    if (utils.onScreen(playerLoc, enemies[i].loc)) {
      enemyData.push(enemies[i].loc);
    }
  }

  // enemy fireballs
  for (var i = 0; i < enemyShots.length; i++) {
    if (utils.onScreen(playerLoc, utils.vectorTransform(enemyShots[i]))) {
      enemyShotsData.push(utils.vectorTransform(enemyShots[i]));
    }
  }

  // player fireballs
  for (var i = 0; i < playerShots.length; i++) {
    if (utils.onScreen(playerLoc, utils.vectorTransform(playerShots[i]))) {
      playerShotsData.push(utils.vectorTransform(playerShots[i]));
    }
  }

  data.players = playerData;
  data.playerShotsData = playerShotsData;
  data.enemyShotsData = enemyShotsData;
  data.enemies = enemyData;
  data.health = player.health;

  connection.send(JSON.stringify(data));
};


// -------------------------------- ADD ENEMIES ------------------------------------


// Adds an enemy in new random location, checking that it isn't placed 
// too close to a player or in a boundary
var addEnemy = function(){
  var newEnemy = {};
  var loc = [Math.random()*(options.maxX - 3) + 1.5,
             Math.random()*(options.maxY - 3) + 1.5];
  var goodLoc = true;

  // refactor to a util function 
  do {
    goodLoc = true;
    for (var i = 0; i < players.length; i++) {
      if (utils.checkCollisions(players[i], {loc:loc})) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*(options.maxX - 3) + 1,
           Math.random()*(options.maxY - 3) + 1];
  } while (!goodLoc);

  do {
    goodLoc = true;
    for (var i = 0; i < staticObjects.length; i++) {
      if (utils.checkCollisions(staticObjects[i], {loc:loc})) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*(options.maxX - 3) + 1,
           Math.random()*(options.maxY - 3) + 1];
  } while (!goodLoc);

  newEnemy.loc = loc;
  newEnemy.delta = [0,0];
  enemies.push(newEnemy);
};

// ---------------------------------- GAME BUILD --------------------------------------


// this is an object holding the world characteristics (originally)
exports.build = {
  enemies: enemies,
  staticObjects: staticObjects,
  borderX: gameBoard.boardSize,
  borderY: gameBoard.boardSize,
  board: gameBoard.boardArray
};

// Adds player starting position and ID to the build data above to send to client, 
// so they can construct the game board and make valid websocket updates
exports.addPosAndIdToBuild = function(){
  var goodLoc = true;
  var loc = [];
  do {
    loc = [Math.random()*(gameBoard.boardSize - 3) + 1.5,
             Math.random()*(gameBoard.boardSize - 3) + 1.5];
    var row = Math.floor(loc[0]);
    var col = Math.floor(loc[1]);
    goodLoc = true;
    for (var i = 0; i < enemies.length; i++){
      if (utils.distance(loc, enemies[i].loc) < 3.5) {
        goodLoc = false;
      }
      for (var j = -1; j < 2; j++){
        for (var k = -1; k < 2; k++){
          if (gameBoard.boardArray[row+j][col+k] === 'w'){
            goodLoc = false;
          }
        }
      }
    }
  } while (!goodLoc);
  exports.build.playerStartX = loc[0];
  exports.build.playerStartY = loc[1];

  exports.build.pId = ++playerIdIncrementer;
};
