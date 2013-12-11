var tek = require('tek'),
    ServerSide = require('./serverside'),
    Err = ServerSide.Err,
    clientside = require('./clientside').me,
    models = require('../../db/models'),
    User = models['User'];

function validateSign(actual, expect) {
    var valid = expect === actual;
    return valid ? null : new Err({
        cause: 'illegal_sign',
        expect: expect,
        actual: actual
    });
}

exports.MeUpdateSchema = ServerSide.extend(clientside.update, {
    _id: function (value, callback) {
        var s = this,
            actual = value && value.toString(),
            expect = s.expects.sign_user._id;
        var err = validateSign(actual, expect);
        callback(err);
    }
});

exports.MeUpdateSchema.Newer = ServerSide.extend({}, {
    username: new ServerSide.UniqueValidator({
        model: User,
        property: 'username'
    }),
    _vr: new ServerSide.UndefinedValidator({
        cause: 'update_conflict'
    })
})
;
exports.PasswordChangeSchema = ServerSide.extend(clientside.password_change, {
    _id: function (value, callback) {
        var s = this,
            actual = value && value.toString(),
            expect = s.expects.sign_user._id;
        var err = validateSign(actual, expect);
        callback(err);
    }
});

exports.PasswordChangeSchema.Match = ServerSide.extend({}, {
    "password,password_again": function (value, callback) {
        var s = this,
            actual = value[0] == value[1],
            expect = true;
        var valid = expect === actual,
            err = valid ? null : new Err({
                cause: 'password_mismatch',
                expect: expect,
                actual: actual
            });
        callback(err);
    }
});