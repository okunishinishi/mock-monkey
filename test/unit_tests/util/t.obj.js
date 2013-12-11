var should = require('should'),
    obj = require('../../../util/u.obj');


exports.toIdMapTest = function (test) {
    var data = [
        {_id: '111', name: 'Tom'},
        {_id: '222', name: 'John'},
        {_id: '333', name: 'Marry'}
    ];
    var map = obj.toIdMap(data);
    map.should.have.property('111');
    map.should.have.property('222');
    map.should.have.property('333');
    test.done();
};

exports.distinctAttrTest = function (test) {
    var data = [
        {name: 'Kate', gender: 'female'},
        {name: 'Tom', gender: 'male'},
        {name: 'Marry', gender: 'female'}
    ];
    obj.distinctAttr(data, 'name').should.be.lengthOf(3);
    obj.distinctAttr(data, 'gender').should.be.lengthOf(2);
    test.done();
};