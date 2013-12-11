var should = require('should'),
    url = require('../../../util/u.url');

exports.publicResolverTest = function (test) {
    var config = require('../../mock/app.config');
    config.context = '/my_context';
    config.package = {};
    config.package.version = 1;
    var publicResolve = url.publicResolver(config);
    publicResolve('/fav.ico').should.equal('/my_context/fav.ico');
    publicResolve('index').should.equal('index');
    publicResolve('/index').should.equal('/my_context/index');
    publicResolve.css('index').should.equal('/my_context/stylesheets/index.css?v=1');
    publicResolve.js('index').should.equal('/my_context/javascripts/index.js?v=1');
    test.done();
};

exports.appendQueryTest = function (test) {
    var url_string = url.appendQuery('http://localhost/my/path', {v: 1});
    url_string.should.equal('http://localhost/my/path?v=1');
    var url_string2 = url.appendQuery('http://localhost/my/path?q=b', {v: 2});
    url_string2.should.equal('http://localhost/my/path?q=b&v=2');
    test.done();
};