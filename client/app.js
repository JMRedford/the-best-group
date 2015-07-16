
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
// var ws = new WebSocket('ws://127.0.0.1:3000');
//use with ws.send(JSON.stringify(***))