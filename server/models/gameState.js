var exports = module.exports = {};

//server side game state storage here
exports.maxX = 20;  //width of game world in blocks
exports.maxY = 20;  //height of game world in blocks

exports.players = [];

exports.enemies = [];

exports.playerAttacks = [];
//format of playerAttack: {vector: [origin x, origin y, 
//        or enemyAttack:  normalized x, normalized y],
//                         time : timestamp (milisecs?)}

exports.enemyAttacks = [];

var distance = function(loc1,loc2){
  return Math.pow(Math.pow(loc2[1]-loc1[1],2)+Math.pow(loc2[0]-loc1[0],2),0.5);
}

exports.init = function(){

}

exports.addPlayer = function(){
  var loc = [Math.random()*exports.maxX*exports.blockSize,
             Math.random()*exports.maxy*exports.blockSize]
   do{ 
    var goodLoc = true;
    for (var i = 0; i < exports.enemies.length; i++){
      if (distance(goodLoc,exports.enemies[i].loc) < 50) {
        goodLoc = false;
      }
    }
  } while (!goodLoc);
}

exports.addEnemy = function(){

}

var checkCollisions = function(){

}

exports.tickTime = function(){
  //move enemies around and check for collisions
}