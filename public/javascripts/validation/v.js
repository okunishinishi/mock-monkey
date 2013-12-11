/**
 * validations
 *
 */
v = (function (tek) {
    var v = {};
    v.Schema = tek.define({
        init: function (def) {
            var s = this;
            s.validators = [];
            if (def) {
                Object.keys(def).forEach(function (property) {
                    Object.keys(def[property]).forEach(function (key) {
                        var expect = def[property][key];
                        s.addValidator(property, key, expect);
                    });
                });
            }
        },
        properties: {
            addValidator: function (property, key, expect) {
                var s = this;
                var Validator = v.Schema.resolveValidator(key);
                if (Validator) {
                    var validator = new Validator(expect);
                    validator.property = property;
                    s.validators.push(validator);
                } else {
                    console.error('[v.js] unknown schema:', key, expect);
                }
            },
            validate: function (values, callback) {
                var isEmpty = tek.validators.Validator.isEmpty;
                var s = this,
                    validators = s.validators,
                    count = validators.length,
                    errors = [];

                function next() {
                    count--;
                    var finish = count <= 0;
                    if (finish) {
                        callback(errors.length && errors || null);
                    }
                }

                validators.forEach(function (validator) {
                    var property = validator.property,
                        value = values[property];
                    var skip = isEmpty(value) && validator.skipIfEmpty;
                    if (skip) {
                        next();
                        return;
                    }
                    validator.validate(value, function (err) {
                        if (err) {
                            err.property= property;
                            errors.push(err);
                        }
                        next();
                    });
                });
            },
            clone: function () {
                var s = this,
                    clone = new v.Schema;
                clone.validators = s.validators;
                return clone;
            }
        }
    });
    v.Schema.resolveValidator = function (key) {
        var name = key.substr(0, 1).toUpperCase() + key.substr(1) + 'Validator';
        var Validator = tek.validators[name];
        if (Validator) {
            return Validator
        } else {
            if (typeof(value) === 'function') {
                return tek.validators['ConformValidator'];
            } else {
                return null;
            }
        }
    };
    v.Schema.Err = function (data) {
        var s = this;
        tek.copy(data, s);
    };


    /**
     * for serverside validation test
     */
    v.disableAllValidations = function () {
        console.warn('all clientside validation is disabled');
        v.Schema.prototype.validate = function (values, callback) {
            callback(null);
        };
    };
    return  v;
})(tek);
