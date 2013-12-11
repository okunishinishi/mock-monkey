/**
 * User: okunishitaka
 * Date: 9/19/13
 * Time: 4:17 PM
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver['By'],
    tek = require('tek'),
    copy = tek['meta']['copy'];

var methods = {
    findBy: function (by, value) {
        var s = this;
        return s.findElement(by(value));
    },
    findAllBy: function (by, value) {
        var s = this;
        return s.findElements(by(value));
    },
    findByName: function (name) {
        var s = this;
        return s.findBy(By.name, name);
    },
    findAllByName: function (name) {
        var s = this;
        return s.findAllBy(By.name, name);
    },
    findById: function (id) {
        var s = this;
        return s.findBy(By.id, id);
    },
    findBySelector: function (selector) {
        var s = this;
        return s.findBy(By.css, selector)
    },
    findAllBySelector: function (selector) {
        var s = this;
        return s.findAllBy(By.css, selector)
    }
};
copy(methods, webdriver.WebDriver.prototype);
copy(methods, webdriver.WebElement.prototype);


var prototype = {
    setValue: function (input, value) {
        var rider = this;
        var script = '$(arguments[0]).val(decodeURIComponent("' + encodeURIComponent(value) + '"));';
        return rider.executeScript(script, input);
    },
    waitToClassRemove: function (elm, className, time) {
        var rider = this;
        return rider.wait(function () {
            return elm.getAttribute('class').then(function (found) {
                return !found.match(className);
            });
        }, time || 1000);
    },
    acceptAlert: function () {
        var rider = this;
        rider.switchTo().alert().accept();
    }
};

module.exports = function () {
    var rider = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();
    copy(prototype, rider);
    return  rider;
};