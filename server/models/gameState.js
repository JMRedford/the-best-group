var exports = module.exports = {};

//server side game state storage here
exports.players = [];
//player: {'id':#, 'conn':conn, 'loc':loc}

exports.enemies = [];

exports.staticObjects = [];  
// trees, rocks, etc initialized with loc coords
// format: [{'loc':[x,y]},...]

exports.playerShots = [];
//format of playerAttack: {vector: [origin x, origin y, 
//        or enemyAttack:  normalized x, normalized y],
//                         time : timestamp (milisecs?)}
exports.enemyShots = [];

// build out an options that sets 
//   enemyAmt, staticObjAmt, maxX, maxY, shotSpeed

var options = {
  enemyAmt: 4,
  staticObjAmt: 6,
  maxX: 20,
  maxY: 20,
  shotSpeed: 0.001 // this is (grid squares / milliseconds)
};


var distance = function(loc1,loc2){
  return Math.pow(Math.pow(loc2[1]-loc1[1],2)+Math.pow(loc2[0]-loc1[0],2),0.5);
};

exports.init = function(){
  // create enemies
  for(var i = 0; i < options.enemyAmt; i++) {
    exports.addEnemy();
  }
  for(var j = 0; j < options.staticObjAmt; j++) {
    exports.addStaticObject();
  }
};

// implement exports.blockSize

exports.message = function(target_id, target_loc){
  // search through exports.players array, locate object with matched id, update data
  for(var i = 0; i < exports.players.length; i++) {
    if(exports.players[i]['id'] === target_id) {
      exports.players[i]['loc'] === target_loc;
    }
  }  
};

exports.addPlayer = function(){
  var newPlayer = {};
  var loc = [Math.random()*(options.maxX - 2) + 1,
             Math.random()*(options.maxY - 2) + 1]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.enemies.length; i++){
      if (distance(goodLoc, exports.enemies[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*(options.maxX - 2) + 1,
           Math.random()*(options.maxY - 2) + 1]
  } while (!goodLoc);

  newPlayer['loc'] = loc;
  exports.players.push(newPlayer);
};

exports.addEnemy = function(){
  var newEnemy = {};
  var loc = [Math.random()*(options.maxX - 2) + 1,
             Math.random()*(options.maxY - 2) + 1]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.players.length; i++){
      if (distance(goodLoc, exports.players[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*(options.maxX - 2) + 1,
           Math.random()*(options.maxY - 2) + 1]
  } while (!goodLoc);

  newEnemy['loc'] = loc;
  exports.enemies.push(newEnemy);
};

exports.addStaticObject = function() {
  var newStaticObject = {};
  var loc = [Math.random()*(options.maxX - 2) + 1,
             Math.random()*(options.maxY - 2) + 1]
  do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.staticObjects.length; i++){
      if (distance(goodLoc, exports.staticObjects[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*(options.maxX - 2) + 1,
           Math.random()*(options.maxY - 2) + 1]
  } while (!goodLoc);

  newStaticObject['loc'] = loc;
  exports.staticObjects.push(newStaticObject);
}

exports.checkCollisions = function(enemy, staticObject){
  // check for box collision between player coords
  //   and staticObject coords
  var collided = false;
  if(enemy.loc[0] > staticObject.loc[0] + 1 ||
     enemy.loc[1] > staticObject.loc[1] + 1 ||
     staticObject.loc[0] > enemy.loc[0] + 1 ||
     staticObject.loc[1] > enemy.loc[1] + 1 ) {

    collided = true;
  }
  return collided;
};

exports.vectorTransform = function(shot) {
  var x = shot[0];
  var y = shot[1];
  var dx = shot[2];
  var dy = shot[3];
  var t = shot[4];
  var time = Date.now() % 1000000;
  var dt = time - t;
  var result = [
    x + (dt * dx) * exports.options.shotSpeed,
    y + (dt * dy) * exports.options.shotSpeed
  ]
  return result;

}

exports.tickTime = function(){
  //move enemies around and check for collisions
  // main server refresh loop

  // loop through the players
  //  send data to player through their connections

};

exports.build = {
  staticObjects: exports.staticObjects,
  borderX: options.maxX,
  borderY: options.maxY
}

exports.sendGameStateToPlayer = function(connection) {

  var playerData = [];
  var enemyData = [];
  var playerShots = [];
  var enemyShots = [];

  var data = {};

  for(var i = 0; i < exports.players; i++) {
    playerData.push([exports.players[i].id , exports.players[i].loc]);
  }
  for(var j = 0; j < exports.enemies; j++) {
    enemyData.push(exports.enemies[j].loc);
  }
  for(var k = 0; k < exports.enemyShots; k++) {
    enemyShots.push(exports.vectorTransform(exports.enemyShots[k]));    
  }
  for(var l = 0; l < exports.enemies; l++) {
    playerShots.push(exports.vectorTransform(exports.playerShots[l]));
  }

  data.players = playerData;
  data.enemies = enemyData;
  data.playerShots = playerShots;
  data.enemyShots = enemyShots;

  connection.send(JSON.stringify(data));
};

/* ----------------  handle data from websockets -------------------- */

exports.handleUpdate = function(update) {
  var data = JSON.parse(update);
  
  // add a player id that is incremented on creation

  // handle movement and shot
}











































