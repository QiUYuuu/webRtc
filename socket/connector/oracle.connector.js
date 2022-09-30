const config = require('../conf/config.conf');
const oracledb = require('oracledb');
const msg = {
    ERR1: '-4007 数据库操作失败,请查看日志',
    ERR2: '-4006 连接池对象未初始化',
    ERR3: '-4008 Mongodb 未初始化',
    ERR4: '-4009 数据库连接失败,请查看日志',
};
let pool = null;
const subDbConf = config.oracledb;
const subPoolConf = config.poolAttrs;
const formalParams = [':0', ':1', ':2', ':3', ':4', ':5', ':6', ':7',
    ':8', ':9', ':10', ':11', ':12', ':13', ':14', ':15'];
const defaultNumRows = 10000;
oracledb.fetchAsString = [ oracledb.CLOB ];

for (const key in subDbConf) {
    oracledb['key'] = subDbConf['key'];
}
function init() {
    return new Promise((resolve, reject) => {
        oracledb.createPool({
            user: subPoolConf.user,
            password: subPoolConf.password,
            connectString: subPoolConf.connectionString,
            // edition: 'ORA$BASE', // used for Edition Based Redefintion
            // events: false, // whether to handle Oracle Database FAN and RLB events or support CQN
            // externalAuth: false, // whether connections should be established using External Authentication
            // homogeneous: true, // all connections in the pool have the same credentials
            // poolAlias: 'default', // set an alias to allow access to the pool via a name.
            poolIncrement: 10, // only grow the pool by one connection at a time
            poolMax: 90, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
            poolMin: 5, // start with no connections; let the pool shrink completely
            // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
            poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
            queueTimeout: 6000, // terminate getConnection() calls in the queue longer than 60000 milliseconds
            // sessionCallback: myFunction, // function invoked for brand new connections or by a connection tag mismatch
            // stmtCacheSize: 30 // number of statements that are cached in the statement cache of each connection
        })
            .then(_pool => {
                pool = _pool;
                console.log('[oracle pool] has been created');
                resolve();

                //console.log("Server running at http://localhost:" + httpPort);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    });
}
function inputParamsStringCollection(values) {
    return {
        type: oracledb.STRING,
        dir: oracledb.BIND_IN,
        val: values
    };
}

function executeProcedure1(procedureName, inputParams, outputParams) {
    return new Promise((resolve, reject) => {
        if (pool === null) {
            // log.writeFile(msg.ERR2, ERR_FILE_NAME);
            // console.log(msg.ERR2);
            reject(msg.ERR2);
            return;
        }

        const _format = formatting(procedureName, inputParams, outputParams);
        console.log('procedure ', _format.plsql);
        // console.log('parameter ', _format.params);

        // Checkout a connection from the pool
        pool.getConnection()
            .then(connection => {
                console.log("Connections open: " + pool.connectionsOpen);
                console.log("Connections in use: " + pool.connectionsInUse);

                connection.execute(_format.plsql, _format.params)
                    .then(result => {
                        let promiseList = [];
                        for (let key in outputParams) {
                            promiseList.push(result.outBinds[key].getRows(defaultNumRows));
                        }
                        Promise.all(promiseList).then(resultSet => {
                            resolve(resultSet);
                        }).then(() => {
                            release(connection)
                            //close(connection);
                        }).catch(e => {
                            throw e;
                        });
                    })
                    .catch(err => {
                        // release(connection);
                        /*connection.close()
                            .catch(err => {
                                // Just logging because handleError call below will have already
                                // ended the response.
                                console.error("execute() error release() error", err);
                                log.writeFile(err, `ora_${moment().format('YYYY-MM-DD')}`);
                            });*/
                        console.error("execute() error", err);
                        // log.writeFile(JSON.stringify(_format), ERR_FILE_NAME);
                        // log.writeFile(err, ERR_FILE_NAME);
                        reject(err);
                    });
            })
            .catch(err => {
                console.error("getConnection() error", err);
                // log.writeFile(err, ERR_FILE_NAME);
                reject(err);
            });
    });
}

function executeProcedure(procedureName, inputParams, outputParams) {
    return new Promise((resolve, reject) => {
        if (pool === null) {
            reject(msg.ERR2);
            return;
        }

        const _format = formatting(procedureName, inputParams, outputParams);
        pool.getConnection()
            .then(connection => {
                connection.execute(_format.plsql, _format.params)
                    .then(result => {
                        let promiseList = [];
                        for (let key in outputParams) {
                            if (result.outBinds[key]) {
                                promiseList.push(result.outBinds[key].getRows(defaultNumRows));
                            }
                        }
                        Promise.all(promiseList).then(resultSet => {
                            resolve(resultSet);
                        }).then(() => {
                            let tempAry = [];
                            for (let key in outputParams) {
                                tempAry.push(result.outBinds[key].close());
                            }
                            Promise.all(tempAry).then((a) => {
                                release(connection)
                            })
                        }).catch(e => {
                            console.log(e);
                            close(connection);
                            try {
                            } catch (e) {

                            }
                            reject(e.toString());
                        });
                    })
                    .catch(err => {
                        console.error("execute() error", err);
                        if (err && err.toString() && err.toString().indexOf("ORA-04068") > 0) {
                            pool.close(5, function (error) {
                                init().then();
                            });

                        } else {
                            close(connection)
                        }

                        try {

                        } catch (e) {

                        }
                        reject(err.toString());
                    });
            })
            .catch(err => {
                console.error("getConnection() error", err);
                try {
                } catch (e) {
                }

                reject(err.toString());
            });
    });
}

function close(connection) {
    /* Release the connection back to the connection pool */
    connection.close({drop: true})
        .then(() => {
            console.log('connection closed');
        })
        .catch(err => {
            //console.log("normal release() error", err);
            log.writeFile(err, ERR_FILE_NAME);
        });
}

function outputParamsCursor(outCount) {
    let outputParams = {};
    for (let i = 0; i < outCount; i++) {
        outputParams['output_' + i] = {
            type: oracledb.CURSOR,
            dir: oracledb.BIND_OUT,
        };
    }
    return outputParams;
}

function formatting(procedureName, inputParams, outputParams) {
    let subFormalParams = [];
    let params = {};
    for (let key in inputParams) {
        subFormalParams.push(':' + key);
        params[key] = inputParams[key];
    }
    for (let key in outputParams) {
        subFormalParams.push(':' + key);
        params[key] = outputParams[key];
    }
    const plsql = `BEGIN ${procedureName}(${subFormalParams.join(',')}); END;`;
    return {plsql: plsql, params: params};
}

function inputParamsVal(value) {
    return {val: value};
}

function splicSpecialCode (s) {
    if (typeof s === 'number') {
        return s;
    }
    const pattern = new RegExp(`[<>'"↵\r\n]`, 'g');
    let rs = s.replace(pattern, '');
    return rs;
}

function release(connection) {
    connection.release()
        .then(() => {
            console.log('connection release');
        })
        .catch(err => {
            //console.log("normal release() error", err);
            log.writeFile(err, ERR_FILE_NAME);
        });
}

init();

module.exports = {inputParamsStringCollection, executeProcedure, outputParamsCursor,inputParamsVal};
