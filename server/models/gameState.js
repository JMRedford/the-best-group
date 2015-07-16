var exports = module.exports = {};

//server side game state storage here
exports.maxX = 20;  //width of game world in blocks
exports.maxY = 20;  //height of game world in blocks

exports.players = [];
//player: {'id':#, 'conn':conn, 'loc':loc}

exports.enemies = [];

exports.staticObjects = [];  
// trees, rocks, etc initialized with loc coords

exports.playerAttacks = [];
//format of playerAttack: {vector: [origin x, origin y, 
//        or enemyAttack:  normalized x, normalized y],
//                         time : timestamp (milisecs?)}

exports.enemyAttacks = [];

var distance = function(loc1,loc2){
  return Math.pow(Math.pow(loc2[1]-loc1[1],2)+Math.pow(loc2[0]-loc1[0],2),0.5);
}

exports.init = function(enemyAmt){
  // create enemies
  for(var i = 0; i < enemyAmt; i++) {
    exports.addEnemy();
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
  var loc = [Math.random()*exports.maxX*exports.blockSize,
             Math.random()*exports.maxy*exports.blockSize]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.enemies.length; i++){
      if (distance(goodLoc, exports.enemies[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*exports.maxX*exports.blockSize,
           Math.random()*exports.maxy*exports.blockSize]
  } while (!goodLoc);

  newPlayer['loc'] = loc;
  exports.players.push(newPlayer);
};

exports.addEnemy = function(){
  var newEnemy = {};
  var loc = [Math.random()*exports.maxX*exports.blockSize,
             Math.random()*exports.maxy*exports.blockSize]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.players.length; i++){
      if (distance(goodLoc, exports.players[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*exports.maxX*exports.blockSize,
           Math.random()*exports.maxy*exports.blockSize]
  } while (!goodLoc);

  newEnemy['loc'] = loc;
  exports.enemies.push(newEnemy);
};

exports.addStaticObjects = function() {
  var newStaticObject = {};
  var loc = [Math.random()*exports.maxX*exports.blockSize,
             Math.random()*exports.maxy*exports.blockSize]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.staticObjects.length; i++){
      if (distance(goodLoc, exports.staticObjects[i].loc) < 50) {
        goodLoc = false;
      }
    }
    loc = [Math.random()*exports.maxX*exports.blockSize,
           Math.random()*exports.maxy*exports.blockSize]
  } while (!goodLoc);

  newEnemy['loc'] = loc;
  exports.staticObjects.push(newStaticObject);
}

var checkCollisions = function(enemy, staticObject){
  // check for box collision between player coords
  //   and staticObject coords
  var collided = false;
  if(enemy.loc[0] > staticObject.loc[0] + exports.blockSize ||
     enemy.loc[1] > staticObject.loc[1] + exports.blockSize ||
     staticObject.loc[0] > enemy.loc[0] + exports.blockSize ||
     staticObject.loc[1] > enemy.loc[1] + exports.blockSize ) {

    collided = true;
  }
  return collided;
};

exports.tickTime = function(){
  //move enemies around and check for collisions
};

