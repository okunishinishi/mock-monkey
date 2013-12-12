var r = require('./routes');

exports = module.exports = {
    get: [],
    post: [],
    all: []
};

function get(path, handler) {
    exports.get.push([path, handler]);
}
function post(path, handler) {
    exports.post.push([path, handler]);
}
function all(path, handler) {
    exports.all.push([path, handler]);
}

require('./routes/filters').forEach(function (filter) {
    all('*', filter);
});

get('/', r.index);

var err = r['err'];
get('/404', err['404']);
get('/403', err['403']);
get('/503', err['503']);

var upload = r['upload'];
get('/upload', upload);

var sign = r['sign'];
get('/sign', sign.index);
post('/api/signin', sign.api.signin);
post('/api/signup', sign.api.signup);
post('/signout', sign.signout);
get('/sign/captcha', sign.api.captcha);

var me = r['me'];
get('/mypage', me.index);
post('/api/me/update', me.api.update);
post('/api/me/change_password', me.api.change_password);


var user = r['user'];
post('/api/user/save', user.api.save);
post('/api/user/destroy', user.api.destroy);
get('/api/user.json', user.api.list);
get('/api/user/:_id', user.api.one);
post('/api/user/change_password', user.api.change_password);

var admin = r['admin'];
get('/admin/user', admin.user);
get('/admin/master', admin.master);
var resource = r['resource'];
get('/resource', resource.index);
post('/api/resource/save', resource.api.save);
post('/api/resource/destroy', resource.api.destroy);
get('/api/resource.json', resource.api.list);
get('/api/resource/:_id', resource.api.one);


var mock = r['mock'];
all('/mock/*', mock);