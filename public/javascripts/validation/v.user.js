/**
 * validation for user page
 */
v.user = (function (v) {
    var Schema = v.Schema;
    return {
        insert: new Schema({
            username: {
                required: true,
                minLength: 2
            }
        }),
        update: new Schema({
            _id: {
                required: true
            },
            username: {
                required: true,
                minLength: 2
            },
            email: {
                format: 'email'
            }
        }),
        password_change: new Schema({
            _id: {
                required: true
            },
            password: {
                required: true
            },
            password_again: {
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