var should = require('should'),
    config = require('../../../app.config'),
    path = require('path'),
    resolve = path.resolve;


var workDir = resolve(__dirname, '../../work');
var publish = require('../../../util/u.publish');


exports.publishTest = function (test) {
    var filepath = resolve(workDir, 'published.js');
    publish(filepath, 'l', {key: 1}, function () {
        test.done();
    });
};

exports.namespaceDeclareLinesTest = function (test) {
    var lines = publish.namespaceDeclareLines('report.score.chess');
    lines.should.be.lengthOf(2);
    test.done();
};