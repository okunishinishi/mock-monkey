var path = require('path'),
    resolve = path.resolve,
    config = require('../app.config'),
    backup = require('../util/u.backup'),
    dateformat = require('dateformat'),
    tek = require('tek'),
    cleanBackupDir = backup.cleanBackupDir;

function handleErr(err) {
    console.error(err);
}

(function dbBackup() {
    var save_dirpath = resolve(config.backup.dirpath, 'db');
    tek.file.mkdirP(save_dirpath, function () {
        var dateLabel = dateformat(new Date, 'yyyymmdd-HHMMss'),
            generations = config.backup.generations,
            db_name = config.db.name;
        switch (config.db.kind) {
            case  'mongojs':
                var mongodump_save_path = resolve(save_dirpath, dateLabel);
                backup.mongodump(db_name, mongodump_save_path, function () {
                    cleanBackupDir(generations, save_dirpath, function () {
                        console.log('mongo backup taken:', mongodump_save_path);
                    });
                });
                break;
            case 'sqlite3':
                var sqlite3_path = resolve(config.db.host, config.db.name);
                var sqlite3_save_path = resolve(save_dirpath, dateLabel + '.db');
                tek.file.copy(sqlite3_path, sqlite3_save_path, function (err) {
                    err && handleErr(err);
                    cleanBackupDir(generations, save_dirpath, function () {
                        console.log('sqlite backup taken:', sqlite3_save_path);
                    });
                });
                break;
        }
    });
})();
