require('colors');
const debug = require('debug')('express:sdr');
debug('Application booting');
const config = require('../conf/config.conf');
const port = config.nodeServer.port;
const address = config.nodeServer.address;

//首先检查server是否全都启动成功.然后执行  serverStartup
try{
    require('../components/server.checker').then(serverStartup);
}catch(err){console.log(err);}

function serverStartup() {
    require('http').createServer(require('../app'))
        .listen(port, address)       // 监听127.0.0.1:3000
        .on('error', error => {
            throw error;
        })
        .on('listening', () => {
            console.log('APP has been started successfully!');
            // debug('APP has been started successfully!');
            console.log('Listening on ' + port);
        })
        .on('exit', () => {
            console.log('On exit!!!');
        });
}
