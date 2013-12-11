/**
 * url util
 * @type {exports|*}
 */
var tek = require('tek'),
    copy = tek.meta.copy,
    ensureExtension = tek.file.ensureExtension,
    path = require('path'),
    qs = require('querystring'),
    url = require('url');


exports.appendQuery = function (url_string, query_to_append) {
    var url_obj = url.parse(url_string),
        query_obj = qs.parse(url_obj.query) || {};
    return url.format({
        protocol: url_obj.protocol,
        auth: url_obj.auth,
        host: url_obj.host,
        hash: url_obj.hash,
        pathname: url_obj.pathname,
        search: qs.stringify(copy(query_to_append, query_obj))
    });
};

/**
 * create public file url resolver from config
 * @param config
 * @returns {Function}
 */
exports.publicResolver = function (config) {
    var resolve = path.resolve,
        join = path.join,
        relative = path.relative;

    var version = config.package && config.package.version,
        context = config.context || '' ,
        jsDir = relative(config.publicDir, config.jsDir),
        imgDir = relative(config.publicDir, config.imgDir),
        cssDir = relative(config.publicDir, config.cssDir);


    function resolvePublic(path, version) {
        var resolved = path.match(/^\/.*/) ? resolve('/', context, path.replace(/^\//, '')) : path;
        if (version) {
            resolved = exports.appendQuery(resolved, {v: version});
        }
        return  resolved;
    }

    resolvePublic.js = function (path) {
        path = ensureExtension(path, 'js');
        return resolvePublic(join('/', jsDir, path), version);
    };
    resolvePublic.css = function (path) {
        path = ensureExtension(path, 'css');
        return resolvePublic(join('/', cssDir, path), version);
    };
    resolvePublic.img = function (path) {
        return resolvePublic(join('/', imgDir, path), version);
    };
    return resolvePublic;
};