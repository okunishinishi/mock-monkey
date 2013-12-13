var tek = require('tek'),
    ServerSide = require('./serverside'),
    Err = ServerSide.Err,
    clientside = require('./clientside').resource,
    models = require('../../db/models'),
    Resource = models['Resource'];


exports.ResourceInsertSchema = ServerSide.extend(clientside.insert, {
});

exports.ResourceUpdateSchema = ServerSide.extend(clientside.update, {
});
exports.ResourceUpdateSchema.Data = ServerSide.extend({}, {
    "type,data": function (value, callback) {
        var s = this, err;
        var data = value.data;
        if (!data) {
            callback(null);
            return;
        }
        switch (value.type) {
            case 'xml':
                var XMLParser = require('xmldom').DOMParser;
                new XMLParser({
                    errorHandler: {
                        error: function (e) {
                            err = new Err({
                                cause: 'invalid_xml',
                                expect: '',
                                actual: String(e)
                            });
                        }
                    }
                }).parseFromString(data);
                break;
            case 'json':
                try {
                    JSON.parse(data);
                    break;
                } catch (e) {
                    err = new Err({
                        cause: 'invalid_json',
                        expect: '',
                        actual: String(e)
                    });
                }
                break;
        }
        callback(err);
    }
});
exports.ResourceUpdateSchema.URL = ServerSide.extend({}, {
    "url,url_kind": function (value, callback) {
        var s = this, err;
        var actual = value.pattern;
        if (!actual) {
            callback(null);
            return;
        }
        switch (value.kind) {
            case 'regex':
                try {
                    new RegExp(actual);
                    err = null;
                } catch (e) {
                    err = new Err({
                        cause: 'invalid_regexp',
                        expect: '',
                        actual: String(e)
                    });
                }
                break;
            default :
                err = null;
                break;
        }
        callback(err);
    }
});

exports.ResourceUpdateSchema.Newer = ServerSide.extend({}, {
    _vr: new ServerSide.UndefinedValidator({
        cause: 'update_conflict'
    })
});

exports.ResourceDestroySchema = ServerSide.extend(clientside.destroy, {
});


