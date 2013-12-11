var db = require('../db'),
    config = require('../app.config'),
    v = require('./validations'),
    User = db.models['User'];

/**
 * render index page
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var sign_user = req.sign();
    if (sign_user) {
        exports.success(req, res);
    } else {
        res.render('sign.jade');
    }
};

exports.success = function (req, res) {
    res.redirect('/');
};


/**
 * signout
 * @param req
 * @param res
 */
exports.signout = function (req, res) {
    req.sign(null);
    var l = res.locals.l;
    req.flash('info_alert', l.msg.signout_done);
    res.redirect('/sign');
};


/**
 * ajax routes for sign
 *
 */
exports.api = {};
exports.api.signin = function (req, res) {
    var l = res.locals.l,
        schema = new v.sign.SigninSchema;
    var data = req.body;
    schema.validate(data, function (err) {
        if (err) {
            res.json({err: err});
            return;
        }
        var username_or_email = data.username_or_email,
            password = data.password;
        User.findByAuthData(username_or_email, password, function (user) {
            if (user) {
                user.signin_count = (user.signin_count || 0) + 1;
                user.last_signin = new Date().toString();
                user.update(function () {
                    req.sign(user);
                    res.json({
                        user: req.sign()
                    });
                });
            } else {
                res.json({
                    err_alert: l.err.signin_fail
                });
            }
        });
    });

};
/**
 * ajax signup
 * @param req
 * @param res
 */
exports.api.signup = function (req, res) {
    var l = res.locals.l,
        schema = new v.sign.SignupSchema({
            captcha_text: req.session.captcha_text
        }),
        data = req.body || {};
    schema
        .validate(data, function (err) {
            if (err) {
                res.json({err: err});
                return;
            }
            req.session.captcha_text = null;
            User.newUser(data, function (user) {
                user.signin_count = 1;
                user.last_signin = new Date().toLocaleDateString();
                user.save(function (user) {
                    req.sign(user);
                    req.flash('info_alert', l.msg.signup_done);
                    res.json({
                        user: user
                    });
                });
            });
        });
};

/**
 * generate captcha image and save digit to session
 * @param req
 * @param res
 */
exports.api.captcha = function (req, res) {
    var captcha = require('tek-web')['captcha'],
        text = ('' + Math.random()).substr(3, 5);
    captcha.newBuffer(text, function (err, buffer) {
        if (err) console.error(err);
        req.session.captcha_text = text;
        res.end(buffer);
    });

};
