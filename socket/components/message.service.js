const http = require('http');
const messageServer = require('../conf/global.conf').messageServer;
const options = {
    host: messageServer.host,
    port: messageServer.port,
    path: '/',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
};
const send = (destEndUid, msgContent) => {
    return new Promise((resolve, reject) => {
        options.body = JSON.stringify({destEndUid, msgContent});
        console.log(options);
        const req = http.request(options, response => {
            let str = '';
            response.on('data', chunk => {
                str += chunk
            });
            response.on('end', () => {
                console.log(str);
                resolve('200');
            });
        });
        req.on('error', error => {
            console.log(error);
            reject('Error occured in http request!');
        });
        req.end();
    });
};
module.exports = {send};
