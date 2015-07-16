var exports = module.exports = {};

//server side game state storage here
exports.maxX = 20;  //width of game world in blocks
exports.maxY = 20;  //height of game world in blocks

exports.players = [];
//player: {'id':#, 'conn':conn, 'loc':loc}

exports.enemies = [];

exports.staticObjects = [];  
// trees, rocks, etc initialized with loc coords

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
  maxy: 20,
  shotSpeed: 0.001 // this is grid squares / millisecond
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
    exports.addStaticObjects();
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
  var loc = [Math.random()*options.maxX,
             Math.random()*options.maxy]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.enemies.length; i++){
      if (distance(goodLoc, exports.enemies[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*options.maxX,
           Math.random()*options.maxy]
  } while (!goodLoc);

  newPlayer['loc'] = loc;
  exports.players.push(newPlayer);
};

exports.addEnemy = function(){
  var newEnemy = {};
  var loc = [Math.random()*options.maxX,
             Math.random()*options.maxy]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.players.length; i++){
      if (distance(goodLoc, exports.players[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*options.maxX,
           Math.random()*options.maxy]
  } while (!goodLoc);

  newEnemy['loc'] = loc;
  exports.enemies.push(newEnemy);
};

exports.addStaticObjects = function() {
  var newStaticObject = {};
  var loc = [Math.random()*options.maxX,
             Math.random()*options.maxy]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.staticObjects.length; i++){
      if (distance(goodLoc, exports.staticObjects[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*options.maxX,
           Math.random()*options.maxy]
  } while (!goodLoc);

  newEnemy['loc'] = loc;
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

exports.vectorTransform = function(x, y, dx, dy, t) {
  var time = Date.now();
  var dt = time - t;
  var result = [
    x + (dt * dx) * exports.options.shotSpeed,
    y + (dt * dy) * exports.options.shotSpeed
  ]
  return result;

}

exports.tickTime = function(){
  //move enemies around and check for collisions

};

exports.sendGameStateToPlayer = function(connection) {
  var playerData = [];
  var enemyData = [];
  var data = {};
  for(var i = 0; i < exports.players; i++) {
    playerData.push([exports.players[i].id , exports.players[i].loc]);
  }
  for(var j = 0; j < exports.enemies; j++) {
    enemyData.push(exports.enemies[j].loc);
  }
  data.players = playerData;
  data.enemies = enemyData;
  data.enemyShots = exports.enemyShots;
  data.playerShots = exports.playerShots;

  connection.send(JSON.stringify(data));

};



