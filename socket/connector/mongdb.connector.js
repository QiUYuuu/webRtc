const config = require('../conf/config.conf');
const mongoose = require('mongoose');
const models = require('../models/schemas');
let _mongodb = null;
let _models = {};
module.exports = {
    /*getConnection: () => {
        return new Promise((resolve, reject) => {
            net.createConnection(dbConfig.port, dbConfig.host)
                .on('connect', () => resolve())
                .on('error', (err) => reject(err));
        })
    },*/
    init: () => {
        return new Promise((resolve, reject) => {
            const options = {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                autoIndex: false, // Don't build indexes
                reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
                reconnectInterval: 1000, // Reconnect every 500ms
                poolSize: 20, // Maintain up to 10 socket connections
                // If not connected, return errors immediately rather than waiting for reconnect
                bufferMaxEntries: 0,
                connectTimeoutMS: 30000, // Give up initial connection after 10 seconds
                socketTimeoutMS: 360000, // Close sockets after 45 seconds of inactivity
                family: 4 // Use IPv4, skip trying IPv6
            };
            const uri = config.CacheClusterUris[0];
            mongoose.createConnection(uri, options)
                .then(connection => {
                    _mongodb = connection;
                    resolve();
                })
                .catch(e => reject(e))
        })
    },
    //indexField需要创建的索引字段
    createIndexes: (schemaName, indexField = null) => {
        let model = getModel(schemaName);
        model.createIndexes(models[schemaName].index(!!indexField ? indexField : {expires: 1}, {expireAfterSeconds: 0}, {background: true}))
            .then()
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                console.error(err);
            })
    },
    ensureIndexes: (schemaName, indexField = null) => {
        let model = getModel(schemaName);
        model.ensureIndexes(models[schemaName].index(!!indexField ? indexField : {expires: 1}, {background: true}))
            .then()
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                console.error(err);
            })
    },
    ensureIndexes_ex: (schemaName, indexField = null,expireAfterSeconds) => {
        let model = getModel(schemaName);
        model.ensureIndexes(models[schemaName].index(!!indexField ? indexField : {expires: 1}, {expireAfterSeconds: expireAfterSeconds}, {background: true}))
            .then()
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                console.error(err);
            })
    },
    save: (schemaName, data) => {
        let model = getModel(schemaName);
        let obj = new model(data);
        return obj.save()
            .then(doc => {
                return 1;
            })
            .catch(err => {
                log.writeFile(schemaName + '---' + JSON.stringify(data), ERR_FILE_NAME).then((a) => {
                    log.writeFile(err, ERR_FILE_NAME).then();
                });

                //throw err;
                return -1;
            })
    },
    //批量插入
    insertMany: async (schemaName, rawDocuments) => {
        try {
            let model = getModel(schemaName);
            const mongooseDocuments = await model.insertMany(rawDocuments);
            return mongooseDocuments.length;
        } catch (e) {
            log.writeFile(schemaName, ERR_FILE_NAME).then((a) => {
                log.writeFile(e, ERR_FILE_NAME).then();
            });
            return e
        }
    },
    select: (schemaName, query) => {
        let model = getModel(schemaName);
        return model.find(query)
            .then(docs => {
                return docs;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return [];
            })
    },
    selectTest: (schemaName, query, option) => {
        let model = getModel(schemaName);
        return model.find(query, option)
            .then(docs => {
                return docs;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return [];
            })
    },
    selectAndSort: (schemaName, query, sortQuery = {}) => {
        let model = getModel(schemaName);
        return model.find(query).sort(sortQuery)
            .then(docs => {
                return docs;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return [];
            })
    },
    selectLastOne: (schemaName, query) => {
        let model = getModel(schemaName);
        return model.find(query).sort({_id: -1}).limit(1)
            .then(docs => {
                return docs;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return [];
            })
    },
    selectByIdAndUpdate: (schemaName, id, update) => {
        let model = getModel(schemaName);
        return model.findById(id)
            .then(doc => {
                if (!!doc) {
                    for (let key in update) {
                        doc[key] = update[key];
                    }
                    return doc.save()
                        .then(doc => {
                            return 1;
                        })
                        .catch(err => {
                            throw err
                        })
                } else return 0;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return -1;
            })
    },
    remove: (schemaName, conditions) => {
        let model = getModel(schemaName);
        return model.remove(conditions)
            .then(doc => {
                if (!!doc) return doc;
                else return 0;
            })
            .catch(err => {
                console.error(err);
                return -1;
            })
    },
    //批量删除 清表用
    delete: (schemaName) => {
        let model = getModel(schemaName);
        return model.deleteMany({})
            .then(doc => {
                if (!!doc) return doc;
                else return 0;
            })
            .catch(err => {
                console.error(err);
                //log.writeFile(err, ERR_FILE_NAME);
                return -1;
            })
    },
    findOneAndUpdate: (schemaName, query, update) => {
        let model = getModel(schemaName);
        return model.findOneAndUpdate(query, {$set: update}, {upsert: false, new: true})
            .then(doc => {
                if (!!doc) return 1;
                else return 0;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return -1;
            })
    },
    findOneAndUpdateOrInsert: (schemaName, query, update) => {
        let model = getModel(schemaName);
        return model.findOneAndUpdate(query, {$set: update}, {upsert: true, new: true})
            .then(doc => {
                if (!!doc) return 1;
                else return 0;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return -1;
            })
    },
    updateMany: (schemaName, query, update) => {
        let model = getModel(schemaName);
        return model.updateMany(query, {$set: update}, {upsert: false, new: true})
            .then(doc => {
                if (!!doc) return 1;
                else return 0;
            })
            .catch(err => {
                log.writeFile(err, ERR_FILE_NAME);
                return -1;
            })
    }
};
const getModel = (name) => {
    if (_mongodb === null) {
        log.writeFile(msg.ERR3, ERR_FILE_NAME);
        console.error(msg.ERR3);
        return null;
    }
    if (!!_models[name]) {
        return _models[name];
    } else {
        _models[name] = _mongodb.model(name, models[name]);
        return _models[name];
    }
};
