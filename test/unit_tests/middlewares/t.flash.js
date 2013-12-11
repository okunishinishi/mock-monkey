var should = require('should'),
    flash = require('../../../middlewares/flash');

exports.flashTest = function (test) {
    var req = {
            session: {
            }
        },
        res = {
            locals: {}
        },
        next = function () {

        };
    flash()(req, res, next);
    should.exist(req.flash);
    test.done();
};