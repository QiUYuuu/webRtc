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
    console.log(`ONE USER CONNECTED NO:${no}`);
    webSocketObject.push({socketId: no, target: ws})
    webSocket.send(JSON.stringify({type: 'no', data: no}));
    for(let i = 0; i < webSocketObject.length; i++) {
        webSocketObject[i]['target'].send(JSON.stringify({type: 'updateUser', users: webSocketObject.map(e => e.socketId)}));
        webSocketObject[i]['target'].send(JSON.stringify({type: 'joinRoom', msg: `用户:${no}加入房间`}));
    }

    ws.on('message', function(msg) {
        console.log(msg);
    });
    ws.on('close', function(msg) {
        const socketIndex = webSocketObject.findIndex(e => e.socketId === no);
        webSocketObject.splice(socketIndex, 1);
        for(let i = 0; i < webSocketObject.length; i++) {
            webSocketObject[i]['target'].send(JSON.stringify({type: 'joinRoom', msg: `用户:${no}离开房间`}));
        }
        console.log(webSocketObject.length);
        console.log(`[SERVER] close()`, msg);
  });


});

// delete req.session.uid;
module.exports = router;
