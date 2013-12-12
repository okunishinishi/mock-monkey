var should = require('should'),
    index = require('../../../routes/r.index.js');

exports.indexTest = function (test) {
    index(null, {
        redirect: function () {
            test.done();
        }
    });
};