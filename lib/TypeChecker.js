'use strict';

module.exports = {
    isObject: function(value){return value != null && typeof value === 'object';},
    isString: function(value){return typeof value === 'string';},
    isNumber: function(value){return typeof value === 'number';},
    isArray: function (value) {
        return Array.isArray(value) || (typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]');
    },
    isDate: function isDate(value) {
        return Object.prototype.toString.call(value) === '[object Date]';
    },
    isFunction: function(value){return typeof value === 'function';},
    isRegExp: function(value){
        return Object.prototype.toString.call(value) === '[object RegExp]';
    }
};