var should = require('should'),
    auth = require('../../../../routes/filters/02.auth');

exports.authTest = function (test) {
    auth.config = {
        enabled: true,
        rules: [
            {
                pattern: /\/admin/,
                roles: ['admin']
            }
        ]
    };
    auth.rolesToBe('/admin').should.be.lengthOf(1);
    test.done();
};