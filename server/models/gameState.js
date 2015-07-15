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

exports.init = function(){

}

exports.addPlayer = function(){

}

exports.addEnemy = function(){

}

var checkCollisions = function(){

}

exports.tickTime = function(){
  //move enemies around and check for collisions
}