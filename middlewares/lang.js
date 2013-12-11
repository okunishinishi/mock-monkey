module.exports = function (default_lang) {
    function lang() {
        var req = this;
        var accepted = req.headers['accept-language'].split(','),
            primary = accepted && accepted[0],
            lang_region = primary && primary.split(';')[0];
        return lang_region && lang_region.split('-')[0] || default_lang;
    }

    return function (req, res, next) {
        req.lang = req.lang || lang;
        next();
    }
}
;