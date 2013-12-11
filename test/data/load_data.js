#!/usr/bin/env node

var tek = require('tek'),
    fs = require('fs'),
    string = tek['string'],
    toCamel = string['toCamel'],
    resolve = require('path')['resolve'],
    db = require('../../db'),
    seeds2json = require('test-data-printer')['seeds2json'],
    JobQueue = tek['JobQueue'];

var jsonDir = resolve(__dirname, 'json'),
    seedsDir = resolve(__dirname, 'seeds');


function handleErr(err) {
    console.error(err);
}
function load(modelName, data, callback) {
    var Model = db.models[modelName];
    var saveJobs = new JobQueue;
    [].concat(data).forEach(function (data) {
        saveJobs.push(function (next) {
            new Model(data).save(function () {
                console.log('data saved to', modelName);
                next();
            });
        });
    });
    saveJobs.execute(callback);
}

new JobQueue()
    .push(function (next) {
        var models = db['models'];
        var dropJob = new JobQueue;
        Object.keys(models).forEach(function (key) {
            var Model = models[key];

            dropJob.push(function (next) {
                Model.findAll(function (models) {
                    Model.removeAll(models, next);
                });
            });
        });
        dropJob.execute(function () {
            next();
        });
    })
    .push(function (next) {
        fs.exists(jsonDir, function (exists) {
            if (exists) {
                next();
            } else {
                fs.mkdir(jsonDir, function (err) {
                    err && handleErr(err);
                    next();
                });
            }
        });
    })
    .push(function (next) {
        seeds2json(seedsDir, jsonDir, next);
    })
    .push(function (next) {
        fs.readdir(jsonDir, function (err, filenames) {
            err && handleErr(err);
            var loadJobs = new JobQueue();
            filenames && filenames.forEach(function (filename) {
                var filepath = resolve(jsonDir, filename);
                var data = require(filepath),
                    name = toCamel(filename.replace(/\.json$/, ''), true);
                loadJobs.push(function (next) {
                    load(name, data, next);
                });
            });
            loadJobs.execute(next);
        });
    })
    .execute(function () {
        db.close();
        console.log('load data done!');
    });