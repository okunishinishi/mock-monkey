var tek = require('tek'),
    ModuleCollector = tek['meta']['ModuleCollector'];

module.exports = new ModuleCollector(__dirname).collect('d');
