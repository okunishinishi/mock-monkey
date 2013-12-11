/**
 * validation for my page
 */
v.me = (function (v) {
    var Schema = v.Schema;
    return {
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
        })
    }
})(v);