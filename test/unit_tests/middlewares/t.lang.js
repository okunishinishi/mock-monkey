var should = require('should'),
    lang = require('../../../middlewares/lang'),
    mockRequest = require('../../mock/mock_request');

exports.fromRequestTest = function (test) {
    var req = mockRequest(),
        res = {},
        next = function () {

        };
    lang()(req, res, next);
    req.lang().should.be.equal('en');
    test.done();
};