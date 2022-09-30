/**
 * Created by randy at 2017/6/29.
 */

const messageServer = {
    host: '127.0.0.1',
    port: '3457'
};
const nodeServer = {
    address: '127.0.0.1',
    port: '5112'
};
const isDebug = require('express')().get('env') === 'production';
module.exports = {
    nodeServer,
    messageServer,
    isDebug
};
