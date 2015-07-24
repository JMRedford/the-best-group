
//This sends something like
/*
GET / HTTP/1.1
        Host: 127.0.0.1:3000
        Upgrade: websocket
        Connection: Upgrade
        Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
        Origin: http://example.com
        Sec-WebSocket-Protocol: chat, superchat
        Sec-WebSocket-Version: 13
*/
var host = location.origin.replace(/^http/, 'ws')

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
  // If user ID not set, set it to the max playerId in server plus 1
  if (!window.userID) {
    window.userID = getMaxInArray(data.players)+1;
  }
  // Else if server does not contain player id, player lost... go to gameover scene
  else if (!contains(data.players, window.userID)) {
    Crafty.scene("GameOver")
  }

  for (var en = 0; en < data.enemies.length; en++) {
    window.enemies.addEnemy(data.enemies[en]);
  }
  for (var p = 0; p < data.playerShotsData.length; p++) {
    window.fireballs.addFireball(data.playerShotsData[p]);
  }
  for (var e = 0; e < data.enemyShotsData.length; e++) {
    window.fireballs.addFireball(data.enemyShotsData[e]);
  }

}
// Helper functions:
function getMaxInArray(numArray) {
  if (numArray.length===0) {return 0}
  return Math.max.apply(null, numArray);
}
function contains(array, value) {
  for (var j = 0; j<array.length; j++) {
    if (array[j]===value) {
      return true
    }
  }
  return false;
}

