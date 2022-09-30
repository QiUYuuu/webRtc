const Promise = require('promise');
const debug = require('debug')('express:sdr');
const monConnentor = require('../connector/mongdb.connector');
var MongoClient = require('mongodb').MongoClient;
const config = require('../conf/config.conf');
const urlParser = url => url.match(/[^(\/\/)]+:[\d]+(?=\/)/)[0].split(':');
// const urlParser = url => url.match(/[^(\/\/)]+:[\d]+(?=\/)/)[0].split(':');


module.exports = new Promise(resolve => {
    console.log('#############Detecting Dependency Servers############');
    Promise.all([]).then(() => {
        console.log('##########Dependency Server Detect Completely########\n')
        resolve();
    });
});
