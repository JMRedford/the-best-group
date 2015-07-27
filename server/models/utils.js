var exports = module.exports = {};

// distance calc helper function
exports.distance = function(loc1,loc2){
  return Math.pow(Math.pow(loc2[1]-loc1[1],2)+Math.pow(loc2[0]-loc1[0],2),0.5);
};

// creates the random enemy movements
exports.randomWalk = function(enemy, options){
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
  enemy.loc = [enemy.loc[0] + newDx, enemy.loc[1] + newDy];
  if (enemy.loc[0] < 1 || enemy.loc[0] > options.maxX - 2){
    enemy.loc[0] = enemy.loc[0] - 2*newDx;
    enemy.delta[0] = -2 * newDx;
  }
  if (enemy.loc[1] < 1 || enemy.loc[1] > options.maxX - 2){
    enemy.loc[1] = enemy.loc[1] - 2*newDy;
    enemy.delta[1] = -2 * newDy;
  }
};

// Collision Checker
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

// Only send to player entities inside the view window.
exports.onScreen = function(playerLoc, thingLoc) {
  return ((thingLoc[0] > playerLoc[0] - 10) &&
          (thingLoc[0] < playerLoc[0] + 10) &&
          (thingLoc[1] > playerLoc[1] - 10) &&
          (thingLoc[1] < playerLoc[1] + 10));
}

