var should = require('should'),
    resource = require('../../../routes/r.resource.js');

exports.indexTest = function (test) {
    resource.index(null, {
        render: function (view) {
            view.should.equal('resource/index.jade');
            test.done();
        }
    });
};