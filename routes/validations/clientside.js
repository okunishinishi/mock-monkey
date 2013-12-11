/**
 * client side validation
 * @type {exports|*}
 */
var fs = require('fs'),
    resolve = require('path').resolve;

var publicJSDir = resolve(__dirname, '../../public/javascripts'),
    publicVDir = resolve(publicJSDir, 'validation');


var window = {},
    v = null,
    tek = null;

function evalScriptFile(filepath) {
    var script = fs.readFileSync(filepath);
    eval(script.toString());
}

module.exports = (function () {
    tek = require(resolve(publicJSDir, 'lib/tek.js'));
    fs.readdirSync(publicVDir).sort(function(a,b){
            return a.split('.').length - b.split('.').length;
        }).forEach(function (filename) {
        evalScriptFile(resolve(publicVDir, filename));
    });
    return v;
})();
