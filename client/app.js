
var host = location.origin.replace(/^http/, 'ws');

// Initiates the websocket connection, sets update intervals and sets the data recieve callback
function startWebSocket() {
  window.ws = new WebSocket(host);
  console.log('sent request');
  ws.onopen = function(e) {
    console.log('socket open');
    window.updateIntID = setInterval(sendUpdates, 100);
    ws.onmessage = function(e) {
      updateBoard(e);
    };
  };
}

// This is the function called by the button on the initial static page 
function initBoard(data) {
  Game.start(data);
  startWebSocket();
}

// This function builds the JSON data regarding player actions and sends it to the server
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


// This function is called everytime new websocket data is recieved
function updateBoard(msg) {
  var data = JSON.parse(msg.data);
  // Clear the board
  window.enemies.clearEnemies();
  window.fireballs.clearFireballs();
  window.players.clearPlayers();
  window.healthBar.clearHealthBar();
  // Close web sockets, and go to game over scene if web lost
  if (data.gameLost) {
    console.log('game over');
    ws.close();
    clearInterval(window.updateIntID);
    Crafty.scene("GameOver");
  } else {
    window.healthBar.drawHealthBar(data.health, [window.player.at().x,window.player.at().y]);
    // If user ID not set, set it to the max playerId in server plus 1
    if (!window.userID) {
      window.userID = getMaxInArray(data.players)+1;
    }

    // Loop through and replace enemies, fireballs in new positions
    for (var i = 0; i < data.enemies.length; i++) {
      window.enemies.addEnemy(data.enemies[i]);
    }
    for (var i = 0; i < data.playerShotsData.length; i++) {
      window.fireballs.addPlayerFireball(data.playerShotsData[i]);
    }
    for (var i = 0; i < data.enemyShotsData.length; i++) {
      window.fireballs.addFireball(data.enemyShotsData[i]);
    }
    for (var i = 0; i < data.players.length; i++) {
      if (data.players[i][0] !== window.userID){
        window.players.addPlayer(data.players[i][1]);
      }
    }
  }
}

// Helper functions:
// Get max number in array; if array is empty, returns 0
function getMaxInArray(numArray) {
  if (numArray.length === 0) {return 0 }
  return Math.max.apply(null, numArray);
}


