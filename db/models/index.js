/**
 * User: okunishitaka
 * Date: 9/21/13
 * Time: 6:28 PM
 */


var tek = require('tek'),
    toCamel = tek['string']['toCamel'],
    ModuleCollector = tek['meta']['ModuleCollector'];

var modules = new ModuleCollector(__dirname).collect('m');
Object.keys(modules).forEach(function (name) {

    exports[toCamel(name, true)] = modules[name];
});
