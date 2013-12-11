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

exports.ResourceUpdateSchema.Newer = ServerSide.extend({}, {
    _vr: new ServerSide.UndefinedValidator({
        cause: 'update_conflict'
    })
});

exports.ResourceDestroySchema = ServerSide.extend(clientside.destroy, {
});


