
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
  ws.onopen = function(e) {
    setInterval(sendUpdates, 100)
    ws.onmessage = function(e) {
      updateBoard(e)
    }
  }
}

function initBoard(data) {
  Game.start(data)
  startWebSocket();
}

function sendUpdates() {
  var data = {
      loc: window.player.at(),
      time: Date.now()
              }
  window.ws.send(JSON.stringify(data))
}

function updateBoard(msg) {
  var data = JSON.parse(msg.data);
}

