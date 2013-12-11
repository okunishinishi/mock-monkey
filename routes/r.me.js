var tek = require('tek'),
    copy = tek.meta.copy,
    db = require('../db'),
    v = require('./validations'),
    User = db.models['User'],
    JobQueue = tek['JobQueue'];


/**
 * render index page
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var sign_user = req.sign();
    if (!sign_user) {
        res.redirect('/404');
        return;
    }
    User.findById(sign_user._id, function (me) {
        req.sign(me);
        res.render('me.jade', {
            me: me
        });
    });
};

exports.api = {
    update: function (req, res) {
        var data = req.body,
            sign_user = req.sign();
        var schema = new v.me.MeUpdateSchema({
            sign_user: sign_user
        });
        schema.validate(data, function (err) {
            if (err) {
                res.json({err: err});
                return;
            }
            User.findById(data._id, function (old) {
                var user = new User(data),
                    diff = user.diff(old);
                var schema = new v.me.MeUpdateSchema.Newer;
                schema.validate(diff.newer(), function (err) {
                    if (err) {
                        res.json({err: err});
                        return;
                    }
                    delete user.password_digest;
                    copy.fallback(old, user);
                    user.update(function (user) {
                        req.sign(user);
                        res.json({
                            model: req.sign()
                        });
                    });
                });
            });
        });
    },

    /**
     * change password
     * @param req
     * @param res
     */
    change_password: function (req, res) {
        var l = res.locals.l;
        var data = req.body,
            sign_user = req.sign();
        var schema = new v.me.PasswordChangeSchema({
            sign_user: sign_user
        });
        schema.validate(data, function (err) {
            if (err) {
                res.json({err: err});
                return;
            }
            var _id = data && data['_id'];
            User.findById(_id, function (user) {
                if (!user) {
                    res.json({
                        err_alert: l.err.something_worng
                    });
                    return;
                }
                var schema = new v.me.PasswordChangeSchema.Match;
                schema.validate({
                    "password,password_again": [data.password , data.password_again]
                }, function (err) {
                    if (err) {
                        res.json({err: err});
                        return;
                    }
                    User.derive(data.password, user.salt, function (password_digest) {
                        delete user.password;
                        user.password_digest = password_digest;
                        user.update(function (user) {
                            req.sign(user);
                            req.flash('info_alert', l.msg.password_did_change);
                            res.json({
                                model: req.sign()
                            });
                        });
                    });
                });
            });
        });
    }
};

