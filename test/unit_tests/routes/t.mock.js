var should = require('should'),
    mock = require('../../../routes/r.mock.js');

exports.getRequestedResourcePathTest = function (test) {
    mock.getRequestedResourcePath({originalUrl: '/mock/abc'}).should.equal('/abc');
    test.done();
};