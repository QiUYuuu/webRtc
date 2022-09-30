
var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');
const express = require('express');
const router = express.Router(null);

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
    fileServer.serve(req, res);
}).listen(3000);

var server = require('http').createServer();
var io = socketIO(server);

server.listen(443);
console.log('11111111111111111');
var persons = [];

var getPersonSeq = function() {
    var tempSeq = Math.floor(Math.random() * 5) + 1;
    persons.forEach(p => {
        if (p.seq == tempSeq) {
            tempSeq = getPersonSeq();
        }
    });
    return tempSeq;
}

io.sockets.on('connection', function(socket) {
    if (persons.indexOf(socket.id) == -1) {
        persons.push({ id: socket.id, seq: getPersonSeq() });
    }
 
    function trace() {
        //socket.emit('server', arguments);
        console.log(arguments);
    }
 
    console.log("用户 '" + socket.id + "' 连接成功！");
    socket.emit('ready', socket.id, persons);
    socket.broadcast.emit('change', persons);
    socket.on('disconnect', function() {
        trace('终端(' + socket.id + ')已断开。 ');
        var tempPersons = [];
        persons.forEach(e => {
            if (e.id != socket.id) {
                tempPersons.push(e);
            }
        });
        persons = tempPersons;
        socket.broadcast.emit('change', persons);
    });
    socket.on('message', function(body) {
        var d = new Date();
        body.from = socket.id;
        body.time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        socket.to(body.to).emit('message', body);
        trace('终端(' + socket.id + "):", body);
    });
    socket.on('ipaddr', function() {
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });
});

module.exports = router;

