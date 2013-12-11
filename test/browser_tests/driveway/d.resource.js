var url = require('./url'),
    webdriver = require('selenium-webdriver'),
    By = webdriver['By'],
    Key = webdriver['Key'];


exports.goIndex = function (rider, callback) {
    rider.get(url.base + 'resource').then(callback);
};


exports.addModel = function (rider, values, callback) {
    rider.findById('resource-list-form')
        .then(function (form) {
            rider.waitToClassRemove(form, 'tk-loading')
        })
        .then(function () {
            rider.findById('resource-add-btn').click();
            rider.findAllBySelector('ul#resource_list li')
                .then(function (li) {
                    var last = li [li.length - 1];
                    return last.findByName('edit-form')
                })
                .then(function (form) {
                    Object.keys(values).forEach(function (name) {
                        var value = values[name];
                        form.findByName(name).then(function (input) {
                            rider.setValue(input, value);
                            input.sendKeys(Key.ENTER);
                        });
                    });
                    rider.waitToClassRemove(form, 'tk-loading')
                })
                .then(function () {
                    callback();
                })
        })
    ;
};

exports.updateModel = function (rider, values, callback) {
    rider
        .findById('resource-list-form')
        .then(function (form) {
            rider.waitToClassRemove(form, 'tk-loading')
        })
        .then(function () {
            rider
                .findById('resource_list')
                .findAllBySelector('li')
                .then(function (li) {
                    var last = li [li.length - 1];
                    return last.findByName('edit-form')
                })
                .then(function (form) {
                    Object.keys(values).forEach(function (name) {
                        var value = values[name];
                        var input = form.findByName(name);
                        rider.setValue(input, value);
                    });
                    form.submit();
                    rider.waitToClassRemove(form, 'tk-loading')
                });

        })
        .then(callback);
};

exports.removeModel = function (rider, callback) {
    rider
        .findById('resource-list-form')
        .then(function (form) {
            rider.waitToClassRemove(form, 'tk-loading')
        })
        .then(function () {
            rider
                .findById('resource_list')
                .findAllBySelector('li')
                .then(function (li) {
                    var last = li [li.length - 1];
                    return last.findByName('destroy-form')
                })
                .then(function (form) {
                    form.findBySelector('[data-role="submit-btn"]')
                        .click();
                    rider.acceptAlert();
                    rider.waitToClassRemove(form, 'tk-loading')
                });
        })
        .then(callback);
};

exports.searchModel = function (rider, searchWord, callback) {
    rider.findById('resource-list-form')
        .then(function (form) {
            rider.waitToClassRemove(form, 'tk-loading');
            return form;
        })
        .then(function (form) {
            form.findByName('search_word')
                .then(function (input) {
                    rider.setValue(input, searchWord);
                    input.sendKeys(Key.ENTER);
                });
            return form;
        })
        .then(function () {
            return rider.findById('resource_list')
                .then(function (ul) {
                    var result = [];
                    ul.findAllBySelector('li')
                        .then(function (li) {
                            li[0].getText().then(function (text) {
                                result.push(text);
                            });
                        });
                    return result;
                });
        })
        .then(callback);
};

