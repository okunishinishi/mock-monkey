var db = require('../db'),
    User = db.models['User'];
/**
 * render user manage page
 * @param req
 * @param res
 */
exports.user = function (req, res) {
    res.render('user.jade', {
        roles: User.ROLES
    });
};

/**
 * render master manage page
 * @param req
 * @param res
 */
exports.master = function (req, res) {
    res.render('master.jade', {

    });
};