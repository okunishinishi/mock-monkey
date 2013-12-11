var tek = require('tek'),
    file = tek.file,
    uuid = tek.uuid,
    copy = file.copy,
    mkdirP = file.mkdirP,
    JobQueue = tek['JobQueue'],
    path = require('path'),
    resolve = path.resolve,
    fs = require('fs'),
    extname = path.extname,
    config = require('../app.config');


function handleErr(err) {
    console.error(err);
}

/**
 * save multiple files with unique name
 * @param save_dirpath
 * @param files
 * @param callback
 */
function saveFiles(save_dirpath, files, callback) {
    var file = files.shift();
    if (file) {
        mkdirP(save_dirpath, function () {
            var save_path = resolve(save_dirpath, uuid().replace(/\-/g, '') + extname(file.name));
            copy(file.path, save_path, function (err) {
                err && handleErr(err);
                saveFiles(save_dirpath, files, function (result) {
                    result.unshift(save_path);
                    callback(result);
                });
            });
        });
    } else {
        callback([]);
    }
}

/**
 * upload files
 * @type {Function}
 */
exports = module.exports = function (req, res) {
    exports.saveUploaded(req, function (result) {
        res.json(result);
    });
};

/**
 * save upload file in request
 * @param req
 * @param callback
 */
exports.saveUploaded = function (req, callback) {
    var queue = new JobQueue;
    var result = {};
    Object.keys(req.files).forEach(function (name) {
        var saveDir = resolve(config.uploadDir, name),
            files = [].concat(req.files[name]);
        queue.push(function (next) {
            saveFiles(saveDir, files, function (saved) {
                result[name] = saved;
                next();
            });
        });
    });
    queue.execute(function () {
        callback(result);
    });
};