var url = require('./url');

exports.goTop = function (rider, callback) {
    rider.get(url.top);
    callback();
};