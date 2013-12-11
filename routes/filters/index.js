var tek = require('tek'),
    ModuleCollector = tek['meta']['ModuleCollector'];

var modules = new ModuleCollector(__dirname).collect();

module.exports = Object.keys(modules).map(function (key) {
    return modules[key];
});