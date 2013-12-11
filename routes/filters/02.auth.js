/**
 * auth filter
 * @type {Function}
 */
exports = module.exports = function (req, res, next) {
    var rolesToBe = exports.rolesToBe(req.path);
    if (!rolesToBe) {
        next();
        return;
    }
    var sign = req.sign(),
        role = sign && sign.role;
    var forbidden = rolesToBe.indexOf(role) === -1;
    if(forbidden){
        res.redirect('/403');
    } else{
        next();
    }
};

exports.config = require('../../app.config')['auth_filter'];

/**
 * roles should be
 * @param path
 * @returns {*}
 */
exports.rolesToBe = function (path) {
    var config = exports.config;
    if (!config.enabled) return null;
    var rules = config.rules;
    for (var i = 0, len = rules.length; i < len; i++) {
        var rule = rules[i],
            hit = path.match(rule.path);
        if (hit) return [].concat(rule.roles);
    }
    return null;
};