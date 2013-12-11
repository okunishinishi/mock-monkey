var config = require('../../app.config'),
    locale = require('../../locale');

module.exports = function (req, res, next) {
    var lang = req.lang();
    res.locals.lang = lang;
    res.locals.l = locale[lang];
    res.locals.sign_user = req.sign();

    var isAPI = !!req.path.match(/api\//);
    if (!isAPI) {
        res.locals.err_alert = req.flash('err_alert');
        res.locals.warn_alert = req.flash('warn_alert');
        res.locals.info_alert = req.flash('info_alert');
    }


    next();
};