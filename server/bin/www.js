require('colors');
const debug = require('debug')('express:sdr');
debug('Application booting');

// const {port, address} = require('../conf/global.conf').nodeServer;
// const app = require('../app');

const port = normalizePort(process.env.PORT || '3001');
// app.set('port', port);

// const server = http.createServer(app);

// server.listen(port,'0.0.0.0');
// server.on('error', onError);
// server.on('listening', onListening);

//首先检查server是否全都启动成功.然后执行  serverStartup
serverStartup()

function normalizePort(val) {
    let port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

  function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

function serverStartup() {
    require('http').createServer(require('../app'))
        .listen(port, '0.0.0.0')       // 监听127.0.0.1:3000
        .on('error', error => {
            throw error;
        })
        .on('listening', () => {
            debug('APP has been started successfully!');
            console.log('APP has been started successfully!');
            console.log('Listening on ' + port);
        })
        .on('exit', () => {
            console.log('On exit!!!');
        });
}
