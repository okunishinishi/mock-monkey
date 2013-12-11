var path = require('path'),
    http = require('http'),
    tek = require('tek'),
    express = require('express'),
    util = require('./util'),
    NODE_ENV = process.env.NODE_ENV,
    config = require('./app.config'),
    locale = require('./locale');


var app = express();

app.configure('all', function () {
    Object.keys(config.set).forEach(function (key) {
        app.set(key, config.set[key]);
    });

    config.use.forEach(function (use) {
        app.use(use);
    });

    app.use(app['router']);
});

app.configure('development', function () {
    var errorHandler = express['errorHandler'];
    app.use(errorHandler());

    var hbs = require('tek-web')['hbs'];
    hbs.precompileAll(config.hbsDir, config.hbsTemplateFile, function () {
        console.log('precompile templates file:', config.hbsTemplateFile);
    });

    var publish = require('./util/u.publish'),
        resolve = require('path').resolve;
    Object.keys(locale).forEach(function (lang) {
        if (lang == 'default') return;
        var filepath = resolve(config.jsDir, "locale", ['l', lang, 'js'].join('.'));
        publish(filepath, 'l', locale[lang], function (filepath) {
            console.log('published locale file:', filepath);
        });
    });

});

app.locals({
    version: config.package.version,
    url: util.url.publicResolver(config),
    NODE_ENV: NODE_ENV,
    context: config.context,
    lib_js_names: config.libJsNames,
    pluralize: require('pluralize'),
    capitalize: tek.string.capitalize
});

(function (routes) {
    Object.keys(routes).sort().forEach(function (method) {
        routes[method].forEach(function (route) {
            app[method](route[0], route[1]);
        });
    });
})(require('./app.route'));


(function (render, redirect) {
    app.response.__proto__.redirect = function (newpath) {
        var s = this;
        newpath = ['/', s.locals.context || '/', newpath].join('').replace(/\/\/+/g, '/');
        return redirect.call(s, newpath);
    };
})(app.response.__proto__.render, app.response.__proto__.redirect);

http.createServer(app).listen(app.get('port'), function () {
    console.log('NODE_ENV=' + NODE_ENV);
    console.log("Express server listening on port " + app.get('port'));
});


function backup() {
    var resolve = require('path')['resolve'];
    var exec = require('child_process').exec,
        command = [
            'node',
            resolve(__dirname, 'bin/backup.js')
        ].join(' ');
    exec(command, function (err, stdout, stderr) {
        if (err) console.error(err);
        if (stderr) console.error(stderr);
        console.log('backup done');
    });
}
backup();
setInterval(backup, config.backup.interval);