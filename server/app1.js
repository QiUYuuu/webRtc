const express = require('express');
const app = express();
const cors = require('cors');

const { createServer } = require('http');
const { Server } = require('socket.io');
const httpClient = createServer();

const socketsObject = {}
const io = new Server(httpClient, {
    cors: {
        origin: '*',
        methods: ['GET', "POST"]
    }
});
io.on('connection', (socket) => {
    socketsObject[socket.id] = socket;
    console.log('a user connected');
    socketsObject[socket.id].emit('request', socket.id);
    socketsObject[socket.id].on('message', (msg) => {
        switch(msg.type) {
            case 'call':
                const d = Object.keys(socketsObject).filter( e => e !== msg.socketId);
                !(d.length === 0) && socketsObject[d[0]].emit('request', {type: 'request sdp&ice', msg: ''});
                break;
        }
        console.log(msg);
    });
    socketsObject[socket.id].on('sendinfo', (msg) => {
        console.log('message' + msg);
        io.emit('some event', msg);
    });
});

app.use(cors(require('./conf/cors.conf')));

require('./routes/http.routemgr')(app);

app.use((req, res, next) => {
    const err = new Error('Not Found' + req.url + '?');
    err.status = 404;
    res.json({'respCode': '404'});
    next(err);
});
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.end('error');
});

io.on('message', (msg) => {
    console.log(msg);
});


function serverStartup() {
    require('http').createServer(app)
        .listen(3001, '0.0.0.0')       // 监听127.0.0.1:3000
        .on('error', error => {
            throw error;
        })
        .on('listening', () => {
            console.log('APP has been started successfully!');
            console.log('Listening on ' + '3001');
        })
        .on('exit', () => {
            console.log('On exit!!!');
        });
}
// serverStartup();

httpClient.listen(3001, () => {
    console.log('socket is listening on 3001');
});

