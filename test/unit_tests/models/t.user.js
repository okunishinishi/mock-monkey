var User = require('../../../db/models/m.user'),
    should = require('should');

exports.newSaltTest = function (test) {
    var salt = User.newSalt();
    should.exist(salt);
    test.done();
};

exports.deriveTest = function (test) {
    User.derive('pass', 'ZQfMfvdPhabs2dbox9iT6MFuSQLbWKKHV4EFHM6FpB19zg', function (digest) {
        digest.should.equal('2001975672219311141261271551816347424742141007111415725515178214232254015510402161531367126952391515842195252239138521707114614021200452133615525012519922273155');
        test.done();
    });
};

exports.newUserTest = function (test) {
    User.newUser({password: 'pass'}, function (user) {
        should.exist(user);
        test.done();
    });
};