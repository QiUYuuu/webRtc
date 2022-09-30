const express = require('express');
const router = express.Router(null);
const monConnentor = require('../../connector/mongdb.connector');
const connection = require('../../connector/oracle.connector');
const FlakeId = require('flake-idgen');
const flakeIdGen = new FlakeId();
const intformat = require('biguint-format');

const WebSocket = require('ws');
const webSocketObject = [];

let webSocket = null;
// 引用Server类:
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
    port: 443
});


wss.on('connection', function (ws) {
    webSocket = ws;
    const no = intformat(flakeIdGen.next(), 'dec');
    webSocketObject[no] = ws;
    webSocketObject.push({socketId: no, target: ws})
    console.log(`[SERVER] connection()`);
    webSocket.send(JSON.stringify({type: 'no', data: no, users: webSocketObject.map(e => e.socketId)}));

    console.log(Object.keys(webSocketObject));
    ws.on('message', function(msg) {
        console.log(msg);
    });
    ws.on('close', function(msg) {
      console.log(`[SERVER] close()`, msg);
  });


});

// delete req.session.uid;
module.exports = router;
