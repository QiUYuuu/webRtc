let mongo = require('../connector/mongdb.connector');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sourceCXSchema = new Schema({
    _id: {type: String},//随机串
    server: {type: String},
    type: {type: String},
    route: {type: String},
    description: {type: String},
    error: {type: String},
    param: {type: String},
    procName: {type: String},
    procParam: {type: String},
    extra: {type: String},
    time: {type: Date},
    expires: {type: Date}
});

let model = mongo.sessionDbConn.model('sourcecxschema', sourceCXSchema);

module.exports = {
    model: model,
    schema: sourceCXSchema,
};
