#!/usr/bin/env node
var resolve = require('path')['resolve'],
    TestRunner = require('tek-web')['TestRunner'];

var dirpath = resolve(__dirname, 'browser_tests');
new TestRunner().prefix('t').run(dirpath);
