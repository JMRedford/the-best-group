
var host = location.origin.replace(/^http/, 'ws');


function startWebSocket() {
  window.ws = new WebSocket(host);
  console.log('sent request');
  ws.onopen = function(e) {
    console.log('socket open');
    setInterval(sendUpdates, 100);
    ws.onmessage = function(e) {
      updateBoard(e);
    };
  };
}

function initBoard(data) {
  Game.start(data);
  startWebSocket();
}

function sendUpdates() {
  var data = {
      pId: window.userID,
      loc: [window.player.at().x, window.player.at().y],
      time: Date.now(),
      nfb : newFireballs
  };
  window.ws.send(JSON.stringify(data));
  newFireballs = [];
}

function updateBoard(msg) {
  var data = JSON.parse(msg.data);
  window.enemies.clearEnemies();
  window.fireballs.clearFireballs();

  if (data.gameLost) {
    console.log('game over');
    Crafty.scene("GameOver");
  } else {
    // If user ID not set, set it to the max playerId in server plus 1
    if (!window.userID) {
      window.userID = getMaxInArray(data.players)+1;
    }
    

    for (var i = 0; i < data.enemies.length; i++) {
      window.enemies.addEnemy(data.enemies[i]);
    }
    for (var i = 0; i < data.playerShotsData.length; i++) {
      window.fireballs.addPlayerFireball(data.playerShotsData[i]);
    }
    for (var i = 0; i < data.enemyShotsData.length; i++) {
      window.fireballs.addFireball(data.enemyShotsData[i]);
    }
  }
}
// Helper functions:
function getMaxInArray(numArray) {
  if (numArray.length === 0) {return 0;}
  return Math.max.apply(null, numArray);
}
function contains(array, value) {
  for (var j = 0; j < array.length; j++) {
    if (array[j][0] === value) {
      return true;
    }
  }
  return false;
}

