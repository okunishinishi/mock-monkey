var db = require('../db'),
    url = require('url'),
    fs = require('fs'),
    config = require('../app.config'),
    path = require('url'),
    Resource = db.models['Resource'];

exports = module.exports = function (req, res) {
    Resource.findAll(function (resources) {

        var requestedPath = exports.getRequestedResourcePath(req),
            resourceFilePath = null,
            resourceType = 'text';
        resources.forEach(function (resource) {
            if (!resource.url) return;
            var pattern = exports.getURLPattern(resource.url_kind, resource.url),
                hit = !!requestedPath.match(pattern);
            if (hit) {
                resourceFilePath = path.resolve('/', config.publicDir + resource.data_path);
                resourceType = resource.type || resourceType;
            }
        });
        if (resourceFilePath) {
            fs.readFile(resourceFilePath, function (err, buffer) {
                if (err) {
                    console.error(err);
                    res.redirect('/503');
                } else {
                    res.setHeader("Content-Type", "text/" + resourceType);
                    res.send(buffer);
                }
            });
        } else {
            res.redirect('/404');
        }
    });
};

exports.getRequestedResourcePath = function (req) {
    return url.resolve('/', req.path.replace('/mock', ''));

};

exports.getURLPattern = function (kind, pattern) {
    switch (kind) {
        case 'regex':
            console.log(pattern.match(/^\\\//), pattern);
            if (!pattern.match(/^\\\//)) {
                //TODO
            }
            return new RegExp(pattern);
            break;
    }
    return url.resolve('/', pattern);
};