var should = require('should'),
    models = require('../../../../db/models'),
    User = models['User'],
    validations = require('../../../../routes/validations');

User.findOneByCondition = function (condition, callback) {
    switch (condition.username) {
        case 'taka_okunishi':
            return callback(new User({username: 'taka_okunishi'}));
    }
    return callback(null);

};
exports.SigninSchemaTest = function (test) {
    var schema = new validations.sign.SigninSchema();
    schema.validate({}, function (err) {
        err.should.be.lengthOf(2);
        schema.validate({
            username_or_email: 'taka_okunishi',
            password: '1386766112174'
        }, function (err) {
            should.not.exist(err);
            test.done();
        });
    });
};
exports.SignupSchemaTest = function (test) {
    var schema = new validations.sign.SignupSchema({
        captcha_text: '1234'
    });
    schema
        .validate({}, function (err) {
            should.exist(err);
            schema.validate({
                username: 'tom',
                password: '1386766112174',
                captcha_text: '1234'
            }, function (err) {
                should.not.exist(err);
                schema.validate({
                    username: 'tom',
                    password: '1386766112174',
                    captcha_text: '5678'
                }, function (err) {
                    err.should.be.lengthOf(1); //invalid captcha
                    test.done();
                });
            });
        });
};

