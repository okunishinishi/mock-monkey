/**
 * switch cache enabled for response
 * @param enabled
 */
function cache(enabled) {
    var res = this;
    if (enabled === false) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
    }
}
module.exports = function () {
    return function (req, res, next) {
        res.cache = res.cache || cache;
        next();
    };
};