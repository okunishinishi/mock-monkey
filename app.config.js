/**
 * User: okunishitaka
 * Date: 9/20/13
 * Time: 6:44 AM
 */

var lessMiddleware = require('less-middleware'),
    express = require('express'),
    path = require('path'),
    env = process['env'],
    resolve = path['resolve'];


var multipart = require('connect-multiparty');

exports.package = require('./package.json');

exports.viewDir = resolve(__dirname, 'views');
exports.publicDir = resolve(__dirname, 'public');
var publicDir = exports.publicDir;

exports.uploadDir = resolve(publicDir, 'uploaded');
exports.jsDir = resolve(publicDir, 'javascripts');
exports.imgDir = resolve(publicDir, 'images');
exports.cssDir = resolve(publicDir, 'stylesheets');
exports.fontDir = resolve(publicDir, 'fonts');
exports.fontStylesheet = resolve(exports.cssDir, 'base/fonts.less');
exports.hbsDir = resolve(publicDir, 'hbs');
exports.hbsTemplateFile = resolve(exports.jsDir, "templates.js");
exports.resourceDir = resolve(publicDir, 'resource');

exports.libJsNames = [
    'jquery.js',
    'jquery-ui.custom.js',
    'spin.js',
    'handlebars.runtime.min.js',
    'tek.js',
    'tek.view.js'
];

exports.set = {
    'port': env['PORT'] || eval('3071'),
    'views': exports.viewDir,
    'view engine': 'jade'
};

var version = exports.package.version;
var middlewares = require('./middlewares');


//noinspection JSUnresolvedFunction
exports.use = [
    express.cookieParser(),
    express.cookieSession({
        secret: '1386766112174' + version.replace(/\./g, '')
    }),
    express.favicon(),
    express.logger('dev'),
    express.compress(),
    express.json(),
    express.urlencoded(),
    express.methodOverride(),
    lessMiddleware({src: publicDir}),
    express.static(publicDir),
    multipart(),
    middlewares.flash(),
    middlewares.sign(),
    middlewares.lang('en'),
    middlewares.cache(),
];


/**
 * available databases
 */
var databases = {
    mongo: {
        kind: 'mongojs',
        host: 'localhost',
        name: 'mock_monkey'.replace(/\./g, '_')
    },
    sqlite: {
        kind: 'sqlite3',
        host: resolve(__dirname),
        name: 'mock_monkey'.replace(/\./g, '_') + ".db"
    }
};

exports.db = databases['mongo'];

exports.backup = {
    interval: 24 * 60 * 60 * 1000,
    generations: 3,
    dirpath: resolve(__dirname, 'backup')
};

exports.context = '';

exports.sign_filter = {
    enabled: false,
    ignore_path: '/javascripts,/images,/stylesheets,/sign'.split(',')
};

exports.auth_filter = {
    enabled:false,
    rules: [
        {
            path: /\/admin\//,
            roles: ['admin']
        }
    ]
};