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
            if (resourceFilePath) return;
            var pattern = exports.getURLPattern(resource.url_kind, resource.url),
                hit = requestedPath.indexOf(pattern) > -1;
            if (hit) {
                resourceFilePath = path.resolve('/', config.publicDir + resource.data_path);
                resourceType = resource.type || resourceType;
            }
        });
        if (resourceFilePath) {
            fs.readFile(resourceFilePath, function (err, buffer) {
                if (err) {
                    console.error(err);
                    res.status('503');
                    res.render('err/503');
                } else {
                    [req.body, req.query].forEach(function (data) {
                        if (!data) return;
                        console.log('data', data);
                        buffer = exports.render(buffer, data);
                    });
                    res.setHeader("Content-Type", "text/" + resourceType);
                    res.send(buffer);
                }
            });
        } else {
            res.status('404');
            res.render('err/404');
        }
    });
};

exports.getRequestedResourcePath = function (req) {
    return url.resolve('/', req.originalUrl.replace('/mock', ''));

};

exports.getURLPattern = function (kind, pattern) {
    switch (kind) {
        case 'regex':
            if (!pattern.match(/^\\\//)) {
                //TODO
            }
            return new RegExp(pattern);
            break;
    }
    pattern = pattern.split('?').shift();
    return url.resolve('/', pattern);
};

exports.render = function (buffer, data) {
    return buffer.toString().replace(/(\${)(.*?)(})/g, function ($0, $1, $2) {
        return data && data[$2] || $0;
    });
};