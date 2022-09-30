const CacheClusterUris = ['10.235.1.35:27017','10.235.1.36:27017','10.235.1.37:27017'];
// `mongodb://10.199.4.22:27017,10.199.4.23:27017,10.199.4.24:27017/yb_session_test?replicaSet=my_repl`
const SessionClusterUris = ['10.235.1.35:27017','10.235.1.36:27017','10.235.1.37:27017'];
const sessionServer = {
    uri: `mongodb://10.235.1.35:27017,10.235.1.36:27017,10.235.1.37:27017/rd-cache`,
    options: {
        useNewUrlParser: true
    }
};
const cacheServer = {
    uri: `mongodb://10.235.1.35:27017,10.235.1.36:27017,10.235.1.37:27017/rd-cache`,
    options: {
        useNewUrlParser: true,
        autoIndex: false, // Don't build indexes
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
    }
};
module.exports = {cacheServer, sessionServer, CacheClusterUris, SessionClusterUris};
