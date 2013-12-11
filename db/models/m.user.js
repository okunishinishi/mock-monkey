var tek = require('tek'),
    auth = tek.auth,
    tekWeb = require('tek-web'),
    DB = tekWeb['DB'],
    defineModel = DB['defineModel'];

var User = module.exports = defineModel({
    username: undefined,
    password_digest: undefined
});


User.findByUsernameOrEmail = function (username_or_email, callback) {
    var s = this;
    return s.findOneByCondition({
        username: username_or_email
    }, function (user) {
        if (user) {
            callback(user);
        } else {
            s.findOneByCondition({
                email: username_or_email
            }, function (user) {
                callback(user);
            });
        }
    });
};

User.findByAuthData = function (username_or_email, password, callback) {
    var s = this;
    var valid = !!(username_or_email && password);
    if (!valid) {
        return callback && callback(false);
    }
    return s.findByUsernameOrEmail(username_or_email, function (user) {
        if (user) {
            auth.derive(password, user.salt, function (derived) {
                var valid = derived === user.password_digest;
                if (valid) {
                    callback && callback(user);
                } else {
                    callback && callback(null);
                }
            });
        } else {
            callback && callback(null);
        }
    });
};
User.newSalt = function () {
    return auth.newSalt();
};
User.derive = function (password, salt, callback) {
    return auth.derive(password, salt, callback);
};

User.newUser = function (data, callback) {
    var user = new User(data);
    user.salt = User.newSalt();
    var password = user.password || String(new Date().getTime());
    User.derive(password, user.salt, function (password_digest) {
        delete user.password;
        delete user.captcha_text;
        user.password_digest = password_digest;
        callback(user);
    });
};


User.ROLES = 'admin'.split(',');