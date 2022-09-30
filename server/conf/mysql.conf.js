const mysqlConfig = {
    user: 'swkj',
    password: 'qwerasdf',
    database: 'zhangyi_jls_01',
    // database: 'zhangyi_test',

    charset: 'utf8mb4',
    uris: ['10.235.3.41:3306']
};
const mysqlPool = {
    acquireTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 8,
    queueLimit: 0,
    multipleStatements: false
};
const mysqlPoolCluster = {
    canRetry: true,
    removeNodeErrorCount: 1,
    restoreNodeTimeout: 0,
    defaultSelector: 'RANDOM'
};
const getNode = uri => {
    const [host, port] = uri.split(':');
    return {
        host,
        port,
        database: mysqlConfig.database,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        charset: mysqlConfig.charset,
        acquireTimeout: mysqlPool.acquireTimeout,
        waitForConnections: mysqlPool.waitForConnections,
        connectionLimit: mysqlPool.connectionLimit,
        queueLimit: mysqlPool.queueLimit,
        multipleStatements: mysqlPool.multipleStatements
    }
};
const poolCluster = require('mysql').createPoolCluster(mysqlPoolCluster);
mysqlConfig.uris.forEach(uri => poolCluster.add(getNode(uri)));
module.exports = {
    poolCluster,
    mysqlConfig
};
