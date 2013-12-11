/**
 * tek.js
 * - javascript library for tek -
 * @version v0.3.7
 * @author Taka Okunishi
 * @license MIT
 * @date 2013-11-30
 */
(function (tek) {
    
	/**
	 * define newable function
	 * @type {Function}
	 */
	tek.define = (function () {
	    function addProperty(F, property) {
	        for (var name in property) {
	            if (!property.hasOwnProperty(name)) continue;
	            F.prototype[name] = property[name];
	        }
	    }
	
	    function addAttrAccessor(F, attrs) {
	        if (!(attrs instanceof Array)) attrs = [attrs];
	
	        function createAccessor(key) {
	            return function () {
	                var s = this;
	                if (arguments.length) {
	                    s[key] = arguments[0];
	                    return s;
	                } else {
	                    return s[key];
	                }
	            }
	        }
	
	        for (var i = 0, len = attrs.length; i < len; i++) {
	            var attr = attrs[i],
	                value_key = ('_' + attr);
	            if (F.prototype[value_key] === undefined) {
	                F.prototype[value_key] = null;
	            }
	            F.prototype[attr] = createAccessor(value_key);
	        }
	        return F;
	    }
	
	    return function (def) {
	        var F = function () {
	            var s = this;
	            s.init && s.init.apply(s, arguments);
	        };
	        var prototype = def['prototype'] || def['Prototype'];
	        if (prototype) F.prototype = new prototype;
	
	        var properties = def['properties'] || def['property'] || {};
	        addProperty(F, properties);
	
	        var init = def['init'];
	        if (init) F.prototype.init = init;
	
	        var attrAccessor = def['attrAccessor'] || def['attrAccessors'] || [];
	        addAttrAccessor(F, attrAccessor);
	
	        return F;
	    };
	})();
	
	/**
	 * generate uuid
	 */
	tek.uuid = (function () {
	    function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000)
	            .toString(16)
	            .substring(1);
	    }
	
	    return function () {
	        return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
	    }
	})();
	
	
	tek.Query = function (string) {
	    if (!string) return;
	    string = string.replace(/^\?/, '');
	    var s = this;
	    var isQuery = s instanceof tek.Query;
	    if (!isQuery) {
	        return new tek.Query(string);
	    }
	    var queries = string.split('&');
	    for (var i = 0, len = queries.length; i < len; i++) {
	        var query = queries[i];
	        var key_val = query.split('=');
	        var key = decodeURIComponent(key_val[0]);
	        s[key] = decodeURIComponent(key_val[1].replace(/\+/g, ' '));
	    }
	    return s;
	};
	
	tek.Query.fromLocation = function (location) {
	    var search = location.search;
	    return search && tek.Query(search.replace(/^\?/, ''));
	};
	
	/**
	 * save data to local storage
	 * @param key
	 * @param obj
	 */
	tek.toStorage = function (key, obj) {
	    var isString = typeof (obj) === 'string',
	        string = isString ? obj : JSON.stringify(obj);
	    localStorage.setItem(key, string);
	};
	
	/**
	 * restore data from local storage
	 * @param key
	 * @returns {*}
	 */
	tek.fromStorage = function (key) {
	    var string = localStorage.getItem(key);
	    return JSON.parse(string);
	};
	
	tek.math = {};
	/**
	 * make sure to values to iteratable
	 * @param values
	 * @returns {*}
	 */
	tek.ensureIteratable = function (values) {
	    switch (values.length) {
	        case 0:
	            return null;
	        case 1:
	            var $0 = values[0];
	            if ($0 instanceof Array) {
	                return $0
	            } else {
	                return [$0];
	            }
	        default :
	            return Array.prototype.slice.call(values, 0);
	    }
	};
	
	/**
	 * get largest value
	 * @returns {null}
	 */
	tek.math.max = function () {
	    var max = null,
	        values = tek.ensureIteratable(arguments);
	    for (var i = 0, len = values.length; i < len; i++) {
	        var value = values[i];
	        if (max === null) {
	            max = value;
	        } else if (max < value) {
	            max = value;
	        }
	    }
	    return max;
	};
	
	/**
	 * get smallest value
	 * @returns {null}
	 */
	tek.math.min = function () {
	    var min = null,
	        values = tek.ensureIteratable(arguments);
	    for (var i = 0, len = values.length; i < len; i++) {
	        var value = values[i];
	        if (min === null) {
	            min = value;
	        } else if (value < min) {
	            min = value;
	        }
	    }
	    return min;
	};
	
	/**
	 * get sum of values
	 * @returns {number}
	 */
	tek.math.sum = function () {
	    var sum = 0,
	        values = tek.ensureIteratable(arguments);
	    for (var i = 0, len = values.length; i < len; i++) {
	        sum += values[i];
	    }
	    return sum;
	};
	
	/**
	 * get average of values
	 * @returns {number}
	 */
	tek.math.average = function () {
	    var values = tek.ensureIteratable(arguments);
	    var len = values.length;
	    var sum = tek.math.sum(values);
	    return  len ? (sum / len) : null;
	};
	
	/**
	 * composite functions
	 * @returns {Function}
	 */
	tek.composite = function (/**functions**/) {
	    var callables = Array.prototype.slice.call(arguments, 0);
	    return function () {
	        var s = this,
	            result = [];
	        for (var i = 0, len = callables.length; i < len; i++) {
	            var callable = callables[i];
	            var called = callable && callable.apply(s, arguments);
	            result = result.concat(called);
	        }
	        return result;
	    };
	};
	
	
	
	/**
	 * User: okunishitaka
	 * Date: 9/16/13
	 * Time: 3:36 PM
	 */
	
	/**
	 * copy properties
	 * @param src
	 * @param dst
	 */
	tek.copy = function (src, dst) {
	    for (var name in src) {
	        if (!src.hasOwnProperty(name)) continue;
	        dst[name] = src[name];
	    }
	    return dst;
	};
	
	/**
	 * recursive copy
	 * @param src
	 * @param dst
	 * @returns {*}
	 */
	tek.copy.deep = function (src, dst) {
	    var copy = tek.copy;
	    if (!src) return dst;
	    for (var key in src) {
	        if (!src.hasOwnProperty(key)) continue;
	        if (src[key] instanceof Date) {
	            dst[key] = new Date(src[key]);
	        } else if (src[key] instanceof Function) {
	            dst[key] = src[key];
	        } else {
	            if (src[key] instanceof Array) {
	                dst[key] = copy.deep(src[key], dst[key] || []);
	            } else if (src[key] instanceof Object) {
	                dst[key] = copy.deep(src[key], dst[key] || {});
	            } else {
	                dst[key] = src[key];
	            }
	        }
	    }
	    return dst;
	};
	
	
	var crossBrowser = tek.crossBrowser = function (window) {
	    crossBrowser.fallbackObject(window.Object);
	    crossBrowser.fallbackArray(window.Array);
	    crossBrowser.fallbackString(window.String);
	    crossBrowser.fallbackWindow(window);
	    crossBrowser.fallbackNavigator(window.navigator || {});
	    return window;
	};
	crossBrowser.fallbackWindow = function (window) {
	    var fallbacks = crossBrowser.fallbackWindow.fallbacks;
	    if (!window.requestAnimationFrame) window.requestAnimationFrame = fallbacks.requestAnimationFrameFallback(window);
	    if (!window.URL) window.URL = fallbacks.URLFallback(window);
	};
	crossBrowser.fallbackWindow.fallbacks = {
	    requestAnimationFrameFallback: function (window) {
	        return window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.oRequestAnimationFrame ||
	            window.msRequestAnimationFrame ||
	            function (callback) {
	                window.setTimeout(callback, 1000 / 60);
	            };
	    },
	    URLFallback: function (window) {
	        return window.URL || window.webkitURL || window.mozURL || window.msURL;
	    }
	};
	
	crossBrowser.fallbackNavigator = function (navigator) {
	    var fallbacks = crossBrowser.fallbackNavigator.fallbacks;
	    if (!navigator.getUserMedia) navigator.getUserMedia = fallbacks.getUserMediaFallback(navigator);
	};
	crossBrowser.fallbackNavigator.fallbacks = {
	    getUserMediaFallback: function (navigator) {
	        return navigator.getUserMedia ||
	            navigator.webkitGetUserMedia ||
	            navigator.mozGetUserMedia ||
	            navigator.msGetUserMedia;
	    }
	};
	
	crossBrowser.fallbackObject = function (Object) {
	    var fallbacks = crossBrowser.fallbackObject.fallbacks;
	    Object.keys = Object.keys || fallbacks.keysFallback;
	};
	crossBrowser.fallbackObject.fallbacks = {
	    keysFallback: (function () {
	        'use strict';
	        var hasOwnProperty = Object.prototype.hasOwnProperty,
	            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
	            dontEnums = [
	                'toString',
	                'toLocaleString',
	                'valueOf',
	                'hasOwnProperty',
	                'isPrototypeOf',
	                'propertyIsEnumerable',
	                'constructor'
	            ],
	            dontEnumsLength = dontEnums.length;
	
	        return function (obj) {
	            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	                throw new TypeError('Object.keys called on non-object');
	            }
	
	            var result = [], prop, i;
	
	            for (prop in obj) {
	                if (hasOwnProperty.call(obj, prop)) {
	                    result.push(prop);
	                }
	            }
	
	            if (hasDontEnumBug) {
	                for (i = 0; i < dontEnumsLength; i++) {
	                    if (hasOwnProperty.call(obj, dontEnums[i])) {
	                        result.push(dontEnums[i]);
	                    }
	                }
	            }
	            return result;
	        };
	    })()
	};
	
	
	crossBrowser.fallbackArray = function (Array) {
	    var fallbacks = crossBrowser.fallbackArray.fallbacks;
	    Array.prototype.map = Array.prototype.map || fallbacks.mapFallback;
	    Array.prototype.reduce = Array.prototype.reduce || fallbacks.reduceFallback;
	    Array.prototype.filter = Array.prototype.filter || fallbacks.filterFallback;
	    Array.prototype.forEach = Array.prototype.forEach || fallbacks.forEachFallback;
	};
	crossBrowser.fallbackArray.fallbacks = {
	    mapFallback: function (callback, thisArg) {
	
	        var T, A, k;
	
	        if (this == null) {
	            throw new TypeError(" this is null or not defined");
	        }
	
	        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
	        var O = Object(this);
	
	        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
	        // 3. Let len be ToUint32(lenValue).
	        var len = O.length >>> 0;
	
	        // 4. If IsCallable(callback) is false, throw a TypeError exception.
	        // See: http://es5.github.com/#x9.11
	        if (typeof callback !== "function") {
	            throw new TypeError(callback + " is not a function");
	        }
	
	        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
	        if (thisArg) {
	            T = thisArg;
	        }
	
	        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
	        // the standard built-in constructor with that name and len is the value of len.
	        A = new Array(len);
	
	        // 7. Let k be 0
	        k = 0;
	
	        // 8. Repeat, while k < len
	        while (k < len) {
	
	            var kValue, mappedValue;
	
	            // a. Let Pk be ToString(k).
	            //   This is implicit for LHS operands of the in operator
	            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
	            //   This step can be combined with c
	            // c. If kPresent is true, then
	            if (k in O) {
	
	                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
	                kValue = O[ k ];
	
	                // ii. Let mappedValue be the result of calling the Call internal method of callback
	                // with T as the this value and argument list containing kValue, k, and O.
	                mappedValue = callback.call(T, kValue, k, O);
	
	                // iii. Call the DefineOwnProperty internal method of A with arguments
	                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
	                // and false.
	
	                // In browsers that support Object.defineProperty, use the following:
	                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
	
	                // For best browser support, use the following:
	                A[ k ] = mappedValue;
	            }
	            // d. Increase k by 1.
	            k++;
	        }
	
	        // 9. return A
	        return A;
	    },
	    reduceFallback: function (callback, opt_initialValue) {
	        'use strict';
	        if (null === this || 'undefined' === typeof this) {
	            // At the moment all modern browsers, that support strict mode, have
	            // native implementation of Array.prototype.reduce. For instance, IE8
	            // does not support strict mode, so this check is actually useless.
	            throw new TypeError(
	                'Array.prototype.reduce called on null or undefined');
	        }
	        if ('function' !== typeof callback) {
	            throw new TypeError(callback + ' is not a function');
	        }
	        var index, value,
	            length = this.length >>> 0,
	            isValueSet = false;
	        if (1 < arguments.length) {
	            value = opt_initialValue;
	            isValueSet = true;
	        }
	        for (index = 0; length > index; ++index) {
	            if (this.hasOwnProperty(index)) {
	                if (isValueSet) {
	                    value = callback(value, this[index], index, this);
	                }
	                else {
	                    value = this[index];
	                    isValueSet = true;
	                }
	            }
	        }
	        if (!isValueSet) {
	            throw new TypeError('Reduce of empty array with no initial value');
	        }
	        return value;
	    },
	    filterFallback: function (fun /*, thisp*/) {
	        'use strict';
	
	        if (!this) {
	            throw new TypeError();
	        }
	
	        var objects = Object(this);
	        var len = objects.length >>> 0;
	        if (typeof fun !== 'function') {
	            throw new TypeError();
	        }
	
	        var res = [];
	        var thisp = arguments[1];
	        for (var i in objects) {
	            if (objects.hasOwnProperty(i)) {
	                if (fun.call(thisp, objects[i], i, objects)) {
	                    res.push(objects[i]);
	                }
	            }
	        }
	
	        return res;
	    },
	    forEachFallback: function (fn, scope) {
	        'use strict';
	        var i, len;
	        for (i = 0, len = this.length; i < len; ++i) {
	            if (i in this) {
	                fn.call(scope, this[i], i, this);
	            }
	        }
	    }
	}
	;
	crossBrowser.fallbackString = function (String) {
	    var fallbacks = crossBrowser.fallbackString.fallbacks;
	    String.prototype.trim = String.prototype.trim || fallbacks.trim;
	};
	crossBrowser.fallbackString.fallbacks = {
	    trim: function () {
	        return this.replace(/^\s+|\s+$/g, '');
	    }
	};
	
	tek.Vector = tek.define({
	    init: function (values) {
	        var s = this;
	        for (var key in values) {
	            if (!values.hasOwnProperty(key)) continue;
	            s[key] = values[key];
	        }
	    },
	    attrAccessor: "".split(','),
	    properties: {
	        add: function (values) {
	            var s = this;
	            for (var key in s) {
	                if (!s.hasOwnProperty(key)) continue;
	                if (!values.hasOwnProperty(key)) continue;
	                s[key] += values[key];
	            }
	            return s;
	        },
	        scale: function (scale) {
	            var s = this;
	            for (var key in s) {
	                if (!s.hasOwnProperty(key)) continue;
	                s[key] = s[key] * scale;
	            }
	            return s;
	        },
	        revert: function () {
	            var s = this;
	            for (var key in s) {
	                if (!s.hasOwnProperty(key)) continue;
	                s[key] *= -1;
	            }
	            return s;
	        },
	        clone: function () {
	            var s = this;
	            return new tek.Vector(s);
	        }
	    }
	});
	tek.Vector.between = function (from, to) {
	    var Vector = tek.Vector;
	    return new Vector(to).clone().add(new Vector(from).clone().revert());
	};
	
	tek.Animation = tek.define({
	    init: function (from, to) {
	        var Vector = tek.Vector;
	        var s = this;
	        s.from = new Vector(from);
	        s.to = new Vector(to);
	        s.scope = Vector.between(from, to);
	    },
	    attrAccessor: "cursor,frameCount,done".split(','),
	    properties: {
	        _done: false,
	        _frameCount: 100,
	        _cursor: 0, /** indicates current position. 0 ~ 1**/
	        value: function () {
	            var s = this,
	                scale = s.ease(s._cursor);
	            return s.from.clone().add(s.scope.clone().scale(scale));
	        },
	        ease: function (proceed) {
	            //TODO
	            return proceed;
	        },
	        next: function () {
	            var s = this,
	                value = s.value();
	            s.move(1 / s._frameCount);
	            return value;
	        },
	        move: function (amount) {
	            var s = this;
	            s._cursor += amount;
	            if (s._cursor >= 1) {
	                s._done = true;
	                s._cursor = 1;
	            }
	        },
	        start: function (requestAnimationFrame, duration, callback) {
	            if (typeof(arguments[1]) === 'function') {
	                callback = arguments[1];
	                duration = 1500;
	            }
	            var s = this;
	            var startTime = new Date;
	            s._done = false;
	            s._cursor = 0;
	            (function loop() {
	                var t = new Date - startTime;
	                s.move(t / duration - s._cursor);
	                callback(s.value(), s._done);
	                if (!s._done) requestAnimationFrame(loop);
	            })();
	        }
	    }
	});
	tek.toSVG = function (html, w, h) {
	    if (typeof(Blob) === undefined) return null;
	    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>" +
	        "<foreignObject width='100%' height='100%'>" +
	        "<div xmlns='http://www.w3.org/1999/xhtml'>" +
	        html +
	        "</div>" +
	        "</foreignObject>" +
	        "</svg>";
	    return  new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
	};
	/**
	 * filter to unique values
	 */
	tek.unique = function (values) {
	    var isArray = values instanceof Array;
	    if (!isArray) values = Array.prototype.splice.call(arguments, 0);
	    return values.filter(function (entry, i) {
	        var first = values.indexOf(entry);
	        return first === i;
	    });
	};
	/**
	 * User: okunishitaka
	 * Date: 9/16/13
	 * Time: 12:14 AM
	 */
	
	var PATTERNS = {
	    ZENKAKU: /[！-～]/g,
	    HANKAKU: /[\!-\~]/g,
	    HIRAGANA: /[ぁ-ん]/g,
	    KATAKANA: /[ァ-ン]/g
	};
	tek.string = {};
	/**
	 * ひらがなへ変換
	 * @param str
	 * @returns {*}
	 */
	tek.string.toHiragana = function (str) {
	    return str && str.replace(PATTERNS.KATAKANA, function (s) {
	        return String.fromCharCode(s.charCodeAt(0) - 0x60);
	    });
	};
	
	/**
	 * カタカナへ変換
	 * @param str
	 * @returns {*}
	 */
	tek.string.toKatakana = function (str) {
	    return str && str.replace(PATTERNS.HIRAGANA, function (s) {
	        return String.fromCharCode(s.charCodeAt(0) + 0x60);
	    });
	};
	
	/**
	 * 半角へ変換
	 * @param str
	 * @returns {*}
	 */
	tek.string.toHankaku = function (str) {
	    return str && str.replace(PATTERNS.ZENKAKU, function (s) {
	        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	    });
	};
	
	/**
	 * 全角へ変換
	 * @param str
	 * @returns {*}
	 */
	tek.string.toZenkaku = function (str) {
	    return str && str.replace(PATTERNS.HANKAKU, function (s) {
	        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
	    });
	};
	
	/**
	 * 曖昧一致
	 */
	tek.string.ambiguousMatch = function (searchWord, pattern) {
	    if (!pattern) return false;
	    if (!searchWord) return false;
	    searchWord = searchWord.trim();
	
	    var string = tek.string;
	    return pattern.match(searchWord) ||
	        string.toHankaku(pattern).match(searchWord) ||
	        string.toZenkaku(pattern).match(searchWord) ||
	        string.toHiragana(pattern).match(searchWord) ||
	        string.toKatakana(pattern).match(searchWord);
	};
	/**
	 * Created by okunishitaka on 11/5/13.
	 */
	
	tek.date = {};
	
	/**
	 * convert date to utc
	 * @param date
	 */
	tek.date.toUTC = function (date) {
	    return Date.UTC(
	        date.getFullYear(),
	        date.getMonth(),
	        date.getDate(),
	        date.getHours(),
	        date.getMinutes(),
	        date.getSeconds(),
	        date.getMilliseconds());
	};
	var detectBrowser = tek.detectBrowser = function (window) {
	    var navigator = window.navigator;
	    if (detectBrowser.isIE(navigator)) {
	        return {
	            browser: 'IE',
	            version: detectBrowser.getIEVersion(navigator)
	        }
	    }
	    if (detectBrowser.isChrome(window)) {
	        return {
	            browser: 'chrome',
	            version: null //TODO
	        }
	    }
	    if (detectBrowser.isFirefox(window)) {
	        return {
	            browser: 'firefox',
	            version: null //TODO
	        }
	    }
	    return null;
	};
	detectBrowser.isChrome = function (window) {
	    return !!(window && window.chrome);
	};
	
	detectBrowser.isFirefox = function (navigator) {
	    var ua = navigator && navigator.userAgent;
	    return !!(ua && ua.toLowerCase().indexOf('firefox') > -1);
	};
	
	
	detectBrowser.isIE = function (navigator) {
	    return navigator && navigator.appName == 'Microsoft Internet Explorer';
	};
	detectBrowser.getIEVersion = function (navigator) {
	    var ua = navigator && navigator.userAgent;
	    if (!ua) return null;
	    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	    return re.exec(ua) ? parseFloat(RegExp.$1) : -1;
	};
	/**
	 * do nothing
	 */
	tek.doNothing = function () {
	
	};
	var define = tek.define;
	/**
	 * Validator
	 * @constructor
	 */
	var Validator = define({
	    init: function (expected) {
	        var s = this;
	        s.expected = expected;
	    },
	    properties: {
	        skipIfEmpty: false,
	        validate: function (value, callback) {
	            callback();
	        }
	    }
	});
	
	/**
	 * Err
	 * @constructor
	 */
	Validator.Err = define({
	    init: function (data) {
	        var s = this;
	        tek.copy(data, s);
	    }
	});
	
	/**
	 * define new Validator
	 * @param properties
	 * @returns Validator
	 */
	Validator.defineValidator = function (properties) {
	    var Defined = define({
	        prototype: Validator,
	        properties: properties
	    });
	    tek.copy(Validator, Defined);
	    return  Defined;
	};
	
	/**
	 * is value empty or not
	 * @param value
	 * @returns {boolean}
	 */
	Validator.isEmpty = function (value) {
	    return (value === null) || (value === undefined) || (value === '');
	};
	
	
	var v = tek.validators = {};
	v.Validator = Validator;
	
	var Err = Validator.Err,
	    defineValidator = Validator.defineValidator;
	
	/**
	 * RequiredValidator
	 * @constructor
	 */
	v.RequiredValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this;
	        var actual = Validator.isEmpty(value),
	            expected = false;
	        var valid = actual === expected,
	            err = valid ? null : new Err({
	                cause: 'required',
	                expected: expected,
	                actual: actual
	            });
	        callback(err);
	    },
	    skipIfEmpty: false
	});
	
	/**
	 * MinLengthValidator
	 * @constructor
	 */
	v.MinLengthValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this,
	            actual = value.length,
	            expected = s.expected;
	        var valid = expected <= actual,
	            err = valid ? null : new Err({
	                cause: 'too_short',
	                expected: expected,
	                actual: actual
	            });
	        callback(err);
	    },
	    skipIfEmpty: true
	});
	
	/**
	 * MaxLengthValidator
	 * @constructor
	 */
	v.MaxLengthValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this,
	            actual = value.length,
	            expected = s.expected;
	        var valid = actual <= expected,
	            err = valid ? null : new Err({
	                cause: 'too_long',
	                expected: expected,
	                actual: actual
	            });
	        callback(err);
	    },
	    skipIfEmpty: true
	});
	
	/**
	 * PatternValidator
	 * @constructor
	 */
	v.PatternValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this,
	            actual = String(value),
	            expected = s.expected;
	        var valid = !!actual.match(s.expected),
	            err = valid ? null : new Err({
	                cause: 'not_match',
	                expected: expected,
	                actual: actual
	            });
	        callback(err);
	    },
	    skipIfEmpty: true
	});
	
	/**
	 * MinimumValidator
	 * @constructor
	 */
	v.MinimumValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this,
	            actual = Number(value),
	            expected = s.expected;
	        var valid = expected <= actual,
	            err = valid ? null : new Err({
	                cause: 'too_small',
	                expected: expected,
	                actual: actual
	            });
	        callback(err);
	    },
	    skipIfEmpty: true
	});
	
	/**
	 * MaximumValidator
	 * @constructor
	 */
	v.MaximumValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this,
	            actual = Number(value),
	            expected = s.expected;
	        var valid = actual <= expected,
	            err = valid ? null : new Err({
	                cause: 'too_large',
	                expected: expected,
	                actual: actual
	            });
	        callback(err);
	    },
	    skipIfEmpty: true
	});
	
	/**
	 * TypeValidator
	 * @constructor
	 */
	v.TypeValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this,
	            actual = typeof(value),
	            expected = s.expected;
	        var valid = typeof(value) === s.expected,
	            err = valid ? null : new Err({
	                cause: 'different_type',
	                expected: expected,
	                actual: actual
	            });
	        callback(err)
	    },
	    skipIfEmpty: true
	});
	
	v.FormatValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this,
	            expected = s.expected,
	            actual = String(value),
	            valid = true;
	        switch (expected) {
	            case 'email':
	                valid = !!actual.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	                break;
	        }
	        var err = valid ? null : new Err({
	            cause: 'mulformat',
	            expected: expected,
	            actual: actual
	        });
	        callback(err);
	    },
	    skipIfEmpty: true
	});
	
	/**
	 * ConformValidator
	 * @constructor
	 */
	v.ConformValidator = defineValidator({
	    validate: function (value, callback) {
	        var s = this;
	        s.expected(value, callback);
	    }
	});
	
	
	
	
    
})(typeof(module) === 'undefined' ? this['tek'] = {} : module.exports);