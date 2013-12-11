#!/usr/bin/env node

var tek = require('tek'),
    file = tek['file'],
    hbs = tek['hbs'],
    fs = require('fs'),
    config = require('../app.config'),
    Handlebars = require('handlebars'),
    tekHTML = require('tek-html'),
    path = require('path'),
    resolve = path['resolve'],
    JobQueue = tek['JobQueue'],
    publicDir = config.publicDir;

function handleErr(err) {
    console.error(err);
}

(function compileHbs(config) {
    var precompileDir = hbs.precompileDir;
    var hbsDir = config.hbsDir,
        outpath = config.hbsTemplateFile;
    precompileDir(hbsDir, outpath, function () {
        console.log('hbs precompiled to :', outpath);
    });
})(config);

(function (js_filenames) {
    var out_dir = resolve(config.jsDir, 'lib');
    var publishQueue = new JobQueue;
    js_filenames.forEach(function (filename) {
        publishQueue.push(function (next) {
            tekHTML.publish(filename, out_dir, next);
        });
    });
    publishQueue.execute(function () {
        console.log('js publish done');
    });
})([
        'tek.js',
        'tek.view.js',
        'jquery.treeview.js',
        'one-color.js',
        'jquery.spreadsheet.js'
    ]);

(function (less_filenames) {
    var out_dir = resolve(publicDir, config.cssDir, 'lib');
    var publishQueue = new JobQueue;
    less_filenames.forEach(function (filename) {
        publishQueue.push(function (next) {
            tekHTML.publish(filename, out_dir, next);
        });
    });
    publishQueue.execute(function () {
        console.log('less publish done');
    });
})([
        'tek-mixin.less',
        'tek-style.less',
        'tek-style-flat.less',
        'tek.view.less',
        'jquery.treeview.less',
        'jquery.spreadsheet.less'
    ]);

(function minifyJs(config) {
    var minify = tekHTML.minify;
    var jsDir = config.jsDir;

    var libDir = resolve(jsDir, 'lib'),
        libAllJs = resolve(jsDir, 'lib.min.js');

    var libFiles = config.libJsNames.map(function (filename) {
        return resolve(libDir, filename);
    });

    minify.concatFiles(libFiles, libAllJs, function () {
        minify.minifyJS(libAllJs, libAllJs, function () {
            console.log('lib js minified to :', libAllJs);
        });
    });

    var vDir = resolve(jsDir, 'validation'),
        vAllJs = resolve(jsDir, 'validation.min.js');
    minify.minifyAllJS(vDir, vAllJs, function () {
        console.log('validation js minified to :', vAllJs);
    }, [/^v\.js$/]);
})(config);

(function generateFontsLess(config) {
    var filesInDir = file.filesInDir,
        extname = path.extname,
        basename = path.basename,
        dirname = path.dirname,
        relative = path.relative;
    var fontDir = config.fontDir;
    var style_filepath = config.fontStylesheet;
    var data = filesInDir(fontDir)
        .filter(function (filepath) {
            return extname(filepath) != '.txt';
        })
        .map(function (filepath) {
            var relative_path = relative(dirname(style_filepath), filepath);
            return {
                src: relative_path,
                name: basename(relative_path).split('.').shift().toLowerCase()
            }
        });
    var tmpl = [
        "{" + "{#each this}" + "}",
        "@font-face {",
        "\tfont-family:{" + "{name}" + "};",
        "\tsrc: ~`\"url('{" + "{src}" + "}')\"`;",
        "}",
        "{" + "{/each}" + "}",
        "{" + "{#each this}" + "}",
        ".font-{" + "{name}" + "}{",
        "\tfont-family:{" + "{name}" + "};",
        "}",
        "{" + "{/each}" + "}",
        ""
    ].join("\n");
    var content = Handlebars.compile(tmpl)(data);
    fs.writeFile(style_filepath, content, function (err) {
        console.log('new font style file:', style_filepath);
        err && handleErr(err);
    });
})(config);


