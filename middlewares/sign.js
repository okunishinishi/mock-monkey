function set(user) {
    var req = this;
    if (req.session === undefined) throw Error('req.sign() requires sessions');
    req.session.sign_user = user;
    if (!req.session.sign_user) return;
    delete req.session.sign_user.password;
    delete req.session.sign_user.password_digest;
    delete req.session.sign_user.salt;
    req.session.sign_user._id = user._id.toString();
}
function clear() {
    set(null);
}
function get() {
    var req = this;
    if (!req.session) return null;
    return req.session.sign_user;
}

function sign() {
    var req = this;
    switch (arguments.length) {
        case 0:
            return get.call(req);
        case 1:
            set.apply(req, arguments);
            break;
    }
    return req;
}
sign.get = get;
sign.set = set;
sign.clear = clear;

module.exports = function () {
    return function (req, res, next) {
        req.sign = req.sign || sign;
        next();
    }
}
;