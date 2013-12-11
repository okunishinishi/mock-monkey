var tek = require('tek'),
    ServerSide = require('./serverside'),
    Err = ServerSide.Err,
    clientside = require('./clientside').sign,
    models = require('../../db/models'),
    User = models['User'];


exports.SigninSchema = ServerSide.extend(clientside.signin, {
});

exports.SignupSchema = ServerSide.extend(clientside.signup, {
    username: [
        new ServerSide.UniqueValidator({
            model: User,
            property: 'username'
        })
    ],
    captcha_text: function (value, callback) {
        var s = this,
            actual = String(value).trim(),
            expect = s.expects.captcha_text;
        var valid = expect === actual,
            err = valid ? null : new Err({
                cause: 'fail_captcha',
                expect: expect,
                actual: actual
            });
        callback(err);
    }
});