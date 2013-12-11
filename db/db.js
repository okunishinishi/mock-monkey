/**
 * db connector
 * @module db
 */


var tek = require('tek'),
    tekWeb = require('tek-web'),
    DB = tekWeb['DB'],
    connectors = DB['connectors'],
    models = require('./models'),
    config = require('../app.config')['db'];

var url = [config.host, config.name].join('/');
module.exports = new DB(url, models, connectors[config.kind]);


