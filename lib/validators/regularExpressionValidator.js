'use strict';
var assign = require('object-assign');
var Validator = require('./validator');

/*
 *  Regular Expression Validator.
 * */
var RegularExpressionRule = assign(Validator, {
    validate: function(value) {
        var flags, isMatch, isValid, isValidValue, message, regEx;
        this.errors = [];
        isValid = true;
        if ((this.decoratedValidator != null)) {
            isValid = this.decoratedValidator.validate(value);
        }
        flags = (this.options.flags != null) && this.options.flags !== void 0 ? this.options.flags : "gmi";
        regEx = new RegExp(this.options.pattern, flags);
        message = "The value did not meet the specified pattern";
        isValidValue = value !== null && value !== void 0 && value !== "";
        if (!isValidValue) {
            this.errors.push(message);
            return false;
        }
        isMatch = regEx.test(value);
        if (!isMatch) {
            this.errors.push(message);
        }
        return isValid && isMatch;
    },
    getErrors: function() {
        if ((this.decoratedValidator != null) && this.decoratedValidator !== void 0) {
            this.errors = this.decoratedValidator.getErrors().concat(this.errors);
        }
        return this.errors;
    }
});

module.exports = RegularExpressionRule;