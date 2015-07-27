// This is the main file that tracks the game state, including positions 
// of all projectiles, enemies, and players

var gameBoard = require('./randomBoard.js');

var exports = module.exports = {};

//server side game state storage here
exports.players = [];
//player: {'pId':#, 'conn':conn, 'loc':[#,#]}

exports.enemies = [];
//enemy: {'loc':[#,#], delta:[#,#]}

exports.staticObjects = [];
// trees, rocks, etc initialized with loc coords
// format: [{'loc':[x,y]},...]

exports.playerShots = [];
//format of playerAttack: {loc: [origin x, origin y],
//        or enemyAttack:  delta: [dx, dy],
//                         time : timestamp (milisecs%1000000)}
exports.enemyShots = [];

var playerIdIncrementer = 0;
// build out an options that sets
//   enemyAmt, staticObjAmt, maxX, maxY, shotSpeed


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

// distance calc helper function
var distance = function(loc1,loc2){
  return Math.pow(Math.pow(loc2[1]-loc1[1],2)+Math.pow(loc2[0]-loc1[0],2),0.5);
};

exports.init = function(){
  //create static objects
  // for (var j = 0; j < options.staticObjAmt; j++) {
  //   exports.addStaticObject();
  // }

  // create enemies
  for (var i = 0; i < options.enemyAmt; i++) {
    exports.addEnemy();
  }
};

// Handles the data sent by clients regarding current pos and shots fired
exports.handleMessage = function(data){
  // Update location
  for (var i = 0; i < exports.players.length; i++) {
    if(exports.players[i].pId === data.pId) {
      exports.players[i].loc = data.loc;
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
      exports.playerShots.push({'loc'   : shot.loc,
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
  exports.players.push(newPlayer);
  newPlayer.health = options.playerMaxHealth;
};

// Adds an enemy in new random location, checking that it isn't placed 
// too close to a player or in a boundary
exports.addEnemy = function(){
  var newEnemy = {};
  var loc = [Math.random()*(options.maxX - 3) + 1.5,
             Math.random()*(options.maxY - 3) + 1.5];
  var goodLoc = true;

  do {
    goodLoc = true;
    for (var i = 0; i < exports.players.length; i++) {
      if (exports.checkCollisions(exports.players[i], {loc:loc})) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*(options.maxX - 3) + 1,
           Math.random()*(options.maxY - 3) + 1];
  } while (!goodLoc);

  do {
    goodLoc = true;
    for (var i = 0; i < exports.staticObjects.length; i++) {
      if (exports.checkCollisions(exports.staticObjects[i], {loc:loc})) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*(options.maxX - 3) + 1,
           Math.random()*(options.maxY - 3) + 1];
  } while (!goodLoc);

  newEnemy.loc = loc;
  newEnemy.delta = [0,0];
  exports.enemies.push(newEnemy);
};


// creates the random enemy movements
exports.randomWalk = function(enemy){
  var max = 0.08;
  var oldDx = enemy.delta[0];
  var oldDy = enemy.delta[1];

  var newDx = oldDx + Math.random()*0.02 - 0.01;
  newDx = Math.max(newDx, -1*max);
  newDx = Math.min(newDx, max);

  var newDy = oldDy + Math.random()*0.02 - 0.01;
  newDy = Math.max(newDy, -1*max);
  newDy = Math.min(newDy, max);

  enemy.delta = [newDx,newDy];
  enemy.loc = [enemy.loc[0]+newDx, enemy.loc[1]+newDy];
  if (enemy.loc[0] < 1 || enemy.loc[0] > options.maxX-2){
    enemy.loc[0] = enemy.loc[0] - 2*newDx;
    enemy.delta[0] = -2 * newDx;
  }
  if (enemy.loc[1] < 1 || enemy.loc[1] > options.maxX-2){
    enemy.loc[1] = enemy.loc[1] - 2*newDy;
    enemy.delta[1] = -2 * newDy;
  }


  // for (var i = 0; i < exports.staticObjects.length; i++){
  //   if (exports.checkCollisions(enemy, exports.staticObjects[i])){
  //     enemy.loc = [enemy.loc[0] - 2*newDx, enemy.loc[1] - 2*newDy];
  //     enemy.delta = [-2*newDx,-2*newDy];
  //   }
  // }

};

// exports.addStaticObject = function() {
//   var newStaticObject = {};
//   var loc = [Math.random()*(options.maxX - 3) + 1.5,
//              Math.random()*(options.maxY - 3) + 1.5];
//   var goodLoc = true;

//   do {
//     goodLoc = true;
//     for (var i = 0; i < exports.staticObjects.length; i++){
//       if (exports.checkCollisions({loc:loc},exports.staticObjects[i])){
//         goodLoc = false;
//       }
//     }
//     loc = [Math.random()*(options.maxX - 3) + 1.5,
//            Math.random()*(options.maxY - 3) + 1.5];
//   } while (!goodLoc);

//   newStaticObject.loc = loc;
//   exports.staticObjects.push(newStaticObject);
// };

exports.checkCollisions = function(a, b){
  // check for box collision between two
  // objects with a .loc property
  return (Math.abs(a.loc[0] - b.loc[0]) < 1 && 
     Math.abs(a.loc[1] - b.loc[1]) < 1);
};


// Calculates a fireballs current position based on known start pos, 
// speed, direction, and timestamp 
exports.vectorTransform = function(shot) {
  var x = shot.loc[0];
  var y = shot.loc[1];
  var dx = shot.delta[0];
  var dy = shot.delta[1];
  var t = shot.time;
  var time = Date.now() % 1000000;
  var dt = time - t;
  var result = [
    x + (dt * dx),
    y + (dt * dy)
  ];
  return result;
};


// This is the main function which advances the game state one 'tick'
exports.tickTime = function(){
  //move enemies around and check for collisions
  for (var i = 0; i < exports.enemies.length; i++){
    exports.randomWalk(exports.enemies[i]);
    if (Math.random() < 0.02){
      //make an enemy shot
      var newShot = {};
      newShot.loc = exports.enemies[i].loc;
      newShot.delta = [exports.enemies[i].delta[0]/10,exports.enemies[i].delta[1]/10];
      newShot.time = Date.now()%1000000;
      exports.enemyShots.push(newShot);
    }
  }

  var playerShotsToRemove = [];
  var enemiesToRemove = [];
  // Note everything that has collided
  for (var i = 0; i < exports.playerShots.length; i++){
    var shot = {loc: exports.vectorTransform(exports.playerShots[i])};
    if (shot.loc[0] > options.maxX || shot.loc[0] < 0 || shot.loc[1] < 0 || shot.loc[1] > options.maxY){
      playerShotsToRemove.push(i);
    }
    for (var j = 0; j < exports.staticObjects.length; j++){
      if (exports.checkCollisions(shot, exports.staticObjects[j])){
        playerShotsToRemove.push(i);
      }
    }
    for (var j = 0; j < exports.enemies.length; j++) {
      if (exports.checkCollisions(shot, exports.enemies[j])){
        playerShotsToRemove.push(i);
        enemiesToRemove.push(j);
      }
    }
  }

  // Set timeouts to spawn new enemies
  for (var i = 0; i < enemiesToRemove.length; i++) {
    setTimeout(exports.addEnemy, 
      (Math.random() * options.enemyRespawnTimeMax) + options.enemyRespawnTimeMin);
  }

  // And remove struck enemies
  enemiesToRemove.sort(function(a,b){ return a - b; });
  for (var i = enemiesToRemove.length - 1; i >= 0; i--){
    exports.enemies.splice(enemiesToRemove[i],1);
  }
  for (var i = playerShotsToRemove.length - 1; i >= 0; i--){
    exports.playerShots.splice(playerShotsToRemove[i],1);
  }
  var enemyShotsToRemove = [];
  for (var k = 0; k < exports.enemyShots.length; k++) {
    var shotLoc = exports.vectorTransform(exports.enemyShots[k]);
    if (shotLoc[0] > options.maxX || shotLoc[1] > options.maxY || shotLoc[0] < 1 || shotLoc[1] < 1){
      enemyShotsToRemove.push(k);
    }
  }
  for (var l = enemyShotsToRemove.length - 1; l >= 0; l--){
    exports.enemyShots.splice(l,1);
  }

  var playersToRemove = [];
  for (var i = 0; i < exports.players.length; i++){
    if (exports.players[i].hit && exports.players[i].hitTime < Date.now() - 500){
      exports.players[i].hit = false;
    }
    for (var j = 0; j < exports.enemyShots.length; j++){
      var shot = {loc: exports.vectorTransform(exports.enemyShots[j])}
      if (exports.players[i].loc){
        if (exports.checkCollisions(exports.players[i],shot) && !exports.players[i].hit){
          exports.players[i].health--;
          exports.players[i].hit = true;
          exports.players[i].hitTime = Date.now();
          if (exports.players[i].health <= 0){
            playersToRemove.push(i);
          }
        }
      }
    }
  }
  for (var i = playersToRemove.length - 1; i >= 0; i--){
    exports.players[playersToRemove[i]].conn.send(JSON.stringify({gameLost:true}));
    exports.players.splice(playersToRemove[i],1);
  }

  // loop through the players
  //  send data to player through their connections
  for (var i = exports.players.length - 1; i >= 0; i--){
    try {

      exports.sendGameStateToPlayer(exports.players[i]);
    } catch (err){
      //remove player from array
      exports.players.splice(i,1);
    }
  }
};

var onScreen = function(playerLoc, thingLoc) {
  return ((thingLoc[0] > playerLoc[0] - 10) &&
          (thingLoc[0] < playerLoc[0] + 10) &&
          (thingLoc[1] > playerLoc[1] - 10) &&
          (thingLoc[1] < playerLoc[1] + 10));
}

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
  for (var i = 0; i < exports.players.length; i++) {
    if (onScreen(playerLoc, exports.players[i].loc)) {
      playerData.push([exports.players[i].pId , exports.players[i].loc]);
    }
  }

  // enemy locations
  for (var i = 0; i < exports.enemies.length; i++) {
    if (onScreen(playerLoc, exports.enemies[i].loc)) {
      enemyData.push(exports.enemies[i].loc);
    }
  }

  // enemy fireballs
  for (var i = 0; i < exports.enemyShots.length; i++) {
    if (onScreen(playerLoc, exports.vectorTransform(exports.enemyShots[i]))) {
      enemyShotsData.push(exports.vectorTransform(exports.enemyShots[i]));
    }
  }

  // player fireballs
  for (var i = 0; i < exports.playerShots.length; i++) {
    if (onScreen(playerLoc, exports.vectorTransform(exports.playerShots[i]))) {
      playerShotsData.push(exports.vectorTransform(exports.playerShots[i]));
    }
  }

  data.players = playerData;
  data.playerShotsData = playerShotsData;
  data.enemyShotsData = enemyShotsData;
  data.enemies = enemyData;
  data.health = player.health;

  connection.send(JSON.stringify(data));
};

// this is an object holding the world characteristics (originally)
exports.build = {
  enemies: exports.enemies,
  staticObjects: exports.staticObjects,
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
    for (var i = 0; i < exports.enemies.length; i++){
      if (distance(loc, exports.enemies[i].loc) < 3.5) {
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
