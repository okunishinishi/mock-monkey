/**
 * validation for user resource
 */
v.resource = (function (v) {
    var Schema = v.Schema;
    return {
        insert: new Schema({
            name: {
                required: true
            }
        }),
        update: new Schema({
            _id: {
                required: true
            },
            url: {
                required: true
            },
            delay: {
            },
            name: {
                required: true
            }
        }),
        destroy: new Schema({
            _id: {
                required: true
            }
        })
    }
})(v);