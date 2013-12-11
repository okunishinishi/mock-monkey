/**
 * serverside validation
 * @param clientside
 * @param validations
 */
var tek = require('tek'),
    define = tek['meta']['define'],
    Schema = require('./clientside')['Schema'],
    JobQueue = tek['JobQueue'];


var Validator = Schema.resolveValidator(''),
    ConformValidator = Schema.resolveValidator('conform');

exports = module.exports = define({
    init: function () {
        var s = this;
        s.validators = [].concat(s.validators);
    },
    prototype: Schema,
    property: {
        addValidator: function (property, validator) {
            var s = this;
            validator.property = property;
            s.validators.push(validator);
            return s;
        }
    }
});

var Err = exports.Err = Schema.Err;

exports.extend = function (clientsideSchema, serversideValidators) {
    return define({
        init: function (expects) {
            var s = this;
            s.expects = expects;
            s.validators = [].concat(clientsideSchema.validators || []);
            if (serversideValidators) {
                Object.keys(serversideValidators).forEach(function (property) {
                    [].concat(serversideValidators[property]).forEach(function (validator) {
                        if (typeof(validator) === 'function') {
                            validator = new ConformValidator(function () {
                                serversideValidators[property].apply(s, arguments);
                            });
                        }
                        s.addValidator(property, validator);
                    });
                });
            }
        },
        prototype: exports
    });
};

var ServersideValidator = define({
    init: function (options) {
        var s = this;
        s.options = options;
    },
    prototype: Validator
});

/**
 * check if model property
 * @type {*}
 */
exports.UniqueValidator = define({
    prototype: ServersideValidator,
    property: {
        validate: function (value, callback) {
            var s = this,
                condition = {};
            var Model = s.options.model,
                property = s.options.property;
            condition[property] = value && value.trim() || '';
            Model.findOneByCondition(condition, function (duplicate) {
                var actual = !!duplicate,
                    expect = false;
                var valid = expect === actual,
                    err = valid ? null : new Err({
                        cause: s.options.cause || 'already_taken',
                        expect: expect,
                        actual: actual
                    });
                callback(err);
            });
        }
    }
});

/**
 * check if value is null
 * @type {*}
 */
exports.NullValidator = define({
    prototype: ServersideValidator,
    property: {
        validate: function (value, callback) {
            var s = this,
                expect = null,
                actual = value;
            var valid = expect === actual,
                err = valid ? null : new Err({
                    cause: s.options.cause || 'should_be_null',
                    expect: expect,
                    actual: actual
                });
            callback(err);
        }
    }
});

/**
 * check if value is undefined
 * @type {*}
 */
exports.UndefinedValidator = define({
    prototype: ServersideValidator,
    property: {
        validate: function (value, callback) {
            var s = this,
                expect = undefined,
                actual = value;
            var valid = expect === actual,
                err = valid ? null : new Err({
                    cause: s.options.cause || 'should_be_null',
                    expect: expect,
                    actual: actual
                });
            callback(err);
        }
    }
});