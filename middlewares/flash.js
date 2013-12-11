function store(key, msg) {
    var req = this;
    if (req.session === undefined) throw Error('req.flash() requires sessions');
    req.session.flash = req.session.flash || {};
    req.session.flash[key] = msg;
}

function consume(key) {
    var s = this;
    if (!s.session.flash) return null;
    var msg = s.session.flash[key];
    delete s.session.flash[key];
    return msg;
}

function flash(key, msg) {
    var req = this;
    switch (arguments.length) {
        case 1:
            return consume.call(req, key);
        case 2:
            store.call(req, key, msg);
            break;
    }
    return req;
}

flash.store = store;
flash.consume = consume;

module.exports = function () {
    return function (req, res, next) {
        req.flash = req.flash || flash;
        next();
    }
}
;
