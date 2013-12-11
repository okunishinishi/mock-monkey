/**
 * handlebars util
 * @type {exports|*}
 */
var tek = require('tek'),
    fs = require('fs'),
    path = require('path'),
    basename = path['basename'],
    relative = path['relative'],
    file = tek['file'],
    JobQueue = tek['JobQueue'],
    filesInDir = file['filesInDir'],
    Handlebars = require('handlebars'),
    precompile = Handlebars['precompile'];

exports.precompileAll = function (srcDir, outFile, callback) {
    var jobQueue = new JobQueue;
    jobQueue.push(function (next) {
        fs.writeFile(outFile, '', function (err) {
            if (err) console.error(err);
            next();
        });
    });
    filesInDir(srcDir).forEach(function (filepath) {
        jobQueue.push(function (next) {
            fs.readFile(filepath, function (err, content) {
                if (err) {
                    console.error(err);
                    next();
                    return;
                }
                var tmplName = relative(srcDir, filepath).replace(/\..*$/, '');
                var precompiled = [
                    '(function() {',
                    '\tvar template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};',
                    '\ttemplates[\'' + tmplName + '\'] = template(' ,
                    '\t' + precompile(content.toString()),
                    '\t);',
                    '})();'
                ].join('\n');
                fs.appendFile(outFile, precompiled, function (err) {
                    if (err) console.error(err);
                    next();
                });
            });
        });
    });
    jobQueue.execute(callback);
};