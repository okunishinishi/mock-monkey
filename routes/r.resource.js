var tek = require('tek'),
    copy = tek.meta.copy,
    db = require('../db'),
    v = require('./validations'),
    Resource = db.models['Resource'];

var search_fields = ['name'];

exports.index = function (req, res) {
    res.render("resource.jade", {

    });
};
exports.api = {
    save: function (req, res) {
        var l = res.locals.l,
            data = req.body || {},
            _id = data._id;
        if (_id) {
            new v.resource.ResourceUpdateSchema().validate(data, function (err) {
                if (err) {
                    res.json({err: err});
                    return;
                }
                new v.resource.ResourceUpdateSchema.URL().validate({
                    "url,url_kind": {
                        kind: data.url_kind,
                        pattern: data.url
                    }
                }, function (err) {
                    if (err) {
                        res.json({err: err});
                        return;
                    }
                    Resource.findById(_id, function (old) {
                        var resource = new Resource(data),
                            diff = resource.diff(old);
                        var schema = new v.resource.ResourceUpdateSchema.Newer;
                        schema.validate(diff.newer(), function (err) {
                            if (err) {
                                res.json({err: err});
                                return;
                            }
                            copy.fallback(old, resource);
                            resource.update(function (resource) {
                                res.json({
                                    resource: resource
                                });
                            });
                        });
                    });
                });
            });
        } else {
            new v.resource.ResourceInsertSchema().validate(data, function (err) {
                if (err) {
                    res.json({err: err});
                    return;
                }
                var resource = new Resource(data);
                resource.save(function (resource) {
                    res.json({
                        resource: resource
                    });
                });
            });
        }
    },
    destroy: function (req, res) {
        var data = req.body;
        new v.resource.ResourceDestroySchema().validate(data, function (err) {
            if (err) {
                res.json({err: err});
                return;
            }
            Resource.findById(data._id, function (resource) {
                if (resource) {
                    resource.remove(function () {
                        res.json({count: 1});
                    });
                } else {
                    res.json({count: 0});
                }
            });
        });
    },
    one: function (req, res) {
        var p = req.params,
            _id = p && p._id;
        Resource.findById(_id, function (resource) {
            res.json(resource);
        });
    },
    list: function (req, res) {
        var q = req.query || {},
            search_word = q.search_word,
            limit = Number(q.limit || 500),
            skip = Number(q.skip || 0),
            condition = {};
        if (search_word) {
            search_fields.forEach(function (field) {
                condition[field] = search_word;
            });
            condition = new db.AmbiguousCondition(condition);
        }
        Resource.findByCondition(condition,function (models) {
            res.json(models);
        }).limit(limit).skip(skip);
    }
};