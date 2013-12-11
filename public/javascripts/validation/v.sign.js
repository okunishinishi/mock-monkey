/**
 * validation for sign page
 */
v.sign = (function (v) {
    var Schema = v.Schema;
    return  {
        signin: new Schema({
            username_or_email: {
                required: true
            },
            password: {
                required: true
            }
        }),
        signup: new Schema({
            username: {
                required: true,
                minLength: 2
            },
            password: {
                required: true,
                minLength: 2
            },
            captcha_text: {
                required: true
            }
        })
    };
})(v);
