var should = require('should'),
    index = require('../../../routes/r.index.js');

exports.indexTest = function (test) {
    index(null, {
        render: function (view) {
            view.should.equal('index.jade');
            test.done();
        }
    });
};