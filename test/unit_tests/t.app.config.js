var should = require('should'),
    config = require('../../app.config'),
    fs = require('fs');

'viewDir,publicDir,uploadDir,hbsDir,hbsTemplateFile'.split(',').forEach(function (name) {
    exports[name + 'Test'] = function (test) {
        fs.exists(config[name], function (exist) {
            exist.should.be.true;
            test.done();
        });
    };
});

exports.dbTest = function (test) {
    var db = config['db'];
    should.exist(db);
    should.exist(db.kind);
    should.exist(db.host);
    should.exist(db.name);
    test.done();
};