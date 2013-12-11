/**
 * sign filter
 * @type {Function}
 */
exports = module.exports = function (req, res, next) {
    var needsSign = exports.needsSign(req);
    if (needsSign) {
        req.flash('back_url', req.path);
        res.redirect('/sign');
    } else {
        next();
    }
};

exports.config = require('../../app.config')['sign_filter'];

/**
 * needs login or not
 * @param req
 * @returns {boolean}
 */
exports.needsSign = function (req) {
    var config = exports.config;
    var enabled = config.enabled;
    if (!enabled) return false;
    var ignore_path = config.ignore_path;
    for (var i = 0; i < ignore_path.length; i++) {
        var ignore = req.path.match(ignore_path[i]);
        if (ignore) return false;
    }
    return !req.sign();
};