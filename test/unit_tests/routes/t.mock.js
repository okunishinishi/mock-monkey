var should = require('should'),
    mock = require('../../../routes/r.mock.js');

exports.getRequestedResourcePathTest = function (test) {
    mock.getRequestedResourcePath({path: '/mock/abc'}).should.equal('/abc');
    test.done();
};