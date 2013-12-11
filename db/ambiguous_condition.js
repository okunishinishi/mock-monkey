/**
 * User: okunishitaka
 * Date: 7/6/13
 * Time: 10:16 PM
 */

var tek = require('tek'),
    string = tek['string'],
    toHankaku = string['toHankaku'] ,
    toZenkaku = string['toZenkaku'];

module.exports = function (query) {
    if (!query) return;
    var s = this;
    for (var key in query) {
        if (!query.hasOwnProperty(key)) continue;
        if (!key) continue;
        var str = ".*" + query[key] + ".*";
        str = [
            str,
            str.toLowerCase(),
            str.toUpperCase(),
            toHankaku(str),
            toHankaku(str).toLowerCase(),
            toHankaku(str).toUpperCase(),
            toZenkaku(str),
            toZenkaku(str).toLowerCase(),
            toZenkaku(str).toUpperCase()
        ].join("|");
        s[key] = {
            $regex: new RegExp(str)
        };
    }
};

