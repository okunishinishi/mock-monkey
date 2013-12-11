/**
 * backup util
 * @type {dateFormat|exports|*}
 */
var fs = require('fs'),
    path = require('path'),
    tek = require('tek'),
    resolve = path.resolve,
    basename = path.basename;


/**
 * clean backup dir.
 * sort files by name and remove older ones
 * @param maxcount
 * @param bk_dirpath
 * @param callback
 */
exports.cleanBackupDir = function (maxcount, bk_dirpath, callback) {
    fs.readdir(bk_dirpath, function (err, filenames) {
        if (err) {
            callback(err);
            return;
        }
        filenames.reverse().forEach(function (filename, i) {
            if (filename.match(/^\./)) return;
            var filepath = resolve(bk_dirpath, filename);
            if (maxcount <= i) {
                if (tek.file.isDir(filepath)) {
                    tek.file.rmdirRecursive(filepath);
                } else {
                    fs.unlinkSync(filepath);
                }
            }
        });
        callback && callback();
    });
};

/**
 * execute mongodump
 * @param db_name
 * @param backup_dirpath
 * @param callback
 */
exports.mongodump = function (db_name, backup_dirpath, callback) {
    var exec = require('child_process').exec,
        command = [
            'mongodump',
            '-d', db_name,
            '-o ', backup_dirpath
        ].join(' ');
    exec(command, function (err, stdout, stderr) {
        if (err) console.error(err);
        if (stderr) console.error(stderr);
        callback && callback();
    });
};
