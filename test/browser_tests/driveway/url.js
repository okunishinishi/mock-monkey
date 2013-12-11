var config = require('../../../app.config.js');
exports.base = 'http://localhost:' + config.set.port + '/';
exports.top = exports.base;