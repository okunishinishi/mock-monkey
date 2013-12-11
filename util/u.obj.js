/**
 * create map for _id
 * @param data
 * @returns {*}
 */
exports.toIdMap = function (data) {
    var result = {};
    data && data.forEach(function (data) {
        result[data._id] = data;
    });
    return result;
};

/**
 * extract distinct attr values from array data
 * @param data
 * @param key
 * @returns {*}
 */
exports.distinctAttr = function (data, key) {
    if (!key) return null;
    var attrs = {};
    data && data.map(function (data) {
        if(!data) return;
        attrs[data[key]] = true;
    });
    return Object.keys(attrs);
};