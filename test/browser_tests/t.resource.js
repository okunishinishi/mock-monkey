var tek = require('tek'),
    define = tek['meta']['define'],
    driveway = require('./driveway'),
    new_rider = require('./new_rider'),
    should = require('should');

var resource = driveway['resource'],
    rider = new_rider();

exports.tearDown = function (done) {
    done()
};
exports.goIndexTest = function (test) {
    resource.goIndex(rider, function () {
        test.done();
    });
};
exports.addModelTest = function (test) {
    resource.addModel(rider, {
        name: 'hello_resource'
    }, function () {
        test.done();
    });
};
exports.updateModelTest = function (test) {
    resource.updateModel(rider, {
        name: 'next_resource'
    }, function () {
        test.done();
    });
};
exports.searchModelTest = function (test) {
    resource.searchModel(rider, "resource", function (result) {
        should.exist(result);
        test.done();
    });
};
exports.removeModelTest = function (test) {
    resource.removeModel(rider, function () {
        test.done();
    });
};