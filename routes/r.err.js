/**
 * return 403 err
 * @param req
 * @param res
 */
exports['403'] = function (req, res) {
    res.status('403');
    res.render('err/403');
};


/**
 * return 404 err
 * @param req
 * @param res
 */
exports['404'] = function (req, res) {
    res.status('404');
    res.render('err/404');
};


/**
 * return 503 err
 * @param req
 * @param res
 */
exports['503'] = function (req, res) {
    res.status('503');
    res.render('err/503');
};
