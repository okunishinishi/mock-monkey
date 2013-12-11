var should = require('should'),
    filter = require('../../../../routes/filters/01.sign');

filter.config = {
    enabled: true,
    ignore_path: '/sign,/javascripts'.split(',')
};
exports.needsSignTest = function (test) {
    var req = {
        sign: function () {
            return null;
        },
        path: '/'
    };
    filter.needsSign(req).should.be.true;
    test.done();
};