var should = require('should'),
    locale = require('../../locale');

exports.enTest = function (test) {
    should.exist(locale.en);
    test.done();
};