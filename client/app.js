
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


function startWebSocket() {
  window.ws = new WebSocket('ws://127.0.0.1:3000');
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

