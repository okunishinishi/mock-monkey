var tek = require('tek'),
    copy = tek.meta.copy,
    db = require('../db'),
    v = require('./validations'),
    User = db.models['User'];

var search_fields = ['username'];

exports.api = {
    save: function (req, res) {
        var l = res.locals.l,
            data = req.body || {},
            _id = data._id;
        if (_id) {
            new v.user.UserUpdateSchema().validate(data, function (err) {
                if (err) {
                    res.json({err: err});
                    return;
                }
                User.findById(_id, function (old) {
                    var user = new User(data),
                        diff = user.diff(old);
                    var schema = new v.user.UserUpdateSchema.Newer;
                    schema.validate(diff.newer(), function (err) {
                        if (err) {
                            res.json({err: err});
                            return;
                        }
                        delete user.password_digest;
                        copy.fallback(old, user);
                        user.update(function (user) {
                            res.json({
                                user: user
                            });
                        });
                    });
                });
            });
        } else {
            new v.user.UserInsertSchema().validate(data, function (err) {
                if (err) {
                    res.json({err: err});
                    return;
                }
                User.newUser(data, function (user) {
                    user.save(function (user) {
                        res.json({
                            user: user
                        });
                    });
                });
            });
        }
    },
    destroy: function (req, res) {
        var data = req.body;
        new v.user.UserDestroySchema().validate(data, function (err) {
            if (err) {
                res.json({err: err});
                return;
            }
            User.findById(data._id, function (user) {
                if (user) {
                    user.remove(function () {
                        res.json({count: 1});
                    });
                } else {
                    res.json({count: 0});
                }
            });
        });
    },
    one: function (req, res) {
        var p = req.params,
            _id = p && p._id;
        User.findById(_id, function (user) {
            res.json(user);
        });
    },
    list: function (req, res) {
        var q = req.query || {},
            search_word = q.search_word,
            limit = Number(q.limit || 500),
            skip = Number(q.skip || 0),
            condition = {};
        if (search_word) {
            search_fields.forEach(function (field) {
                condition[field] = search_word;
            });
            condition = new db.AmbiguousCondition(condition);
        }
        User.findByCondition(condition,function (models) {
            res.json(models);
        }).limit(limit).skip(skip);
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
        new v.user.PasswordChangeSchema().validate(data, function (err) {
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
                new v.user.PasswordChangeSchema.Match().validate({
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
                            res.json({
                                info_alert: l.msg.password_did_change,
                                user: user
                            });
                        });
                    });
                });
            });
        });
    }
};