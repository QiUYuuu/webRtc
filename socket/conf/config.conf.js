const isTest = !true;
module.exports = {
    corsConfig: {
        origin: ['http://192.168.2.208', 'http://localhost:5900', 'http://localhost:5900', 'http://localhost:5905', 'http://localhost:5600', 'http://localhost:8100'],
        methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        proxy: true
    },
    nodeServer: {
        address: isTest ? 'localhost' : '',
        // port: '5865'
        port: isTest ? '5500' : '3001' 
    },
    CacheClusterUris: [`mongodb://10.199.4.22:27017,10.199.4.23:27017,10.199.4.24:27017/yb_session_test?replicaSet=my_repl`],
    SessionClusterUris: [`mongodb://10.199.4.22:27017,10.199.4.23:27017,10.199.4.24:27017/yb_session_test?replicaSet=my_repl`],
    sessionServer: {
        uri: [`mongodb://10.199.4.22:27017,10.199.4.23:27017,10.199.4.24:27017/yb_session_test?replicaSet=my_repl`],
        options: {
            useNewUrlParser: true
        }
    },
    cacheServer: {
        uri: [`mongodb://10.199.4.22:27017,10.199.4.23:27017,10.199.4.24:27017/yb_session_test?replicaSet=my_repl`],
        options: {
            useNewUrlParser: true,
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0
        }
    },
    oracledb: {
        queueRequests: true,
        autoCommit: false,
        poolIncrement: 1,
        poolMax: 0,
        poolMin:5,
        poolPingInterval: 60,
        poolTimeout: 60,
        queueTimeout: 0
    },
    poolAttrs: {
        connectionString: '10.199.4.26:1521/orcl',
        user: 'ccsyb',
        password: 'ccsyb',
        poolIncrement: 1,
        homogeneous: true
    },
    imgs: isTest ? 'D:\\ccsyb\\server\\img\\' : 'data/img/',
    isDebug : require('express')().get('env') === 'production',
};
