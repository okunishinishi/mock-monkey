var tek = require('tek'),
    ServerSide = require('./serverside'),
    Err = ServerSide.Err,
    clientside = require('./clientside').user,
    models = require('../../db/models'),
    User = models['User'];


function uniqueUserNameValidator() {
    return new ServerSide.UniqueValidator({
        model: User,
        property: 'username'
    })
}

exports.UserInsertSchema = ServerSide.extend(clientside.insert, {
    username: uniqueUserNameValidator()
});

exports.UserUpdateSchema = ServerSide.extend(clientside.update, {
});

exports.UserUpdateSchema.Newer = ServerSide.extend({}, {
    username: uniqueUserNameValidator(),
    _vr: new ServerSide.UndefinedValidator({
        cause: 'update_conflict'
    })
});

exports.UserDestroySchema = ServerSide.extend(clientside.destroy, {
});


exports.PasswordChangeSchema = ServerSide.extend(clientside.password_change, {
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