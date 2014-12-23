'use strict';
var assign = require('object-assign');
var Validator = require('./validator');

/**
 *  Contain only number Validator.
 */
var OnlyNumberValidator = assign(Validator, {
    validate: function(value) {
        var isNumber, isValid, isValueValid, message;
        this.errors = [];
        isValid = true;
        if ((this.decoratedValidator != null)) {
            isValid = this.decoratedValidator.validate(value);
        }
        message = "The value is not a valid number";
        isValueValid = value !== null && value !== void 0 && value !== "";
        if (!isValueValid) {
            this.errors.push(message);
            return false;
        }
        isNumber = /^\d+$/.test(value);
        if (!isNumber) {
            this.errors.push(message);
        }
        return isValid && isNumber;
    },
    getErrors: function() {
        if ((this.decoratedValidator != null) && this.decoratedValidator !== void 0) {
            this.errors = this.decoratedValidator.getErrors().concat(this.errors);
        }
        return this.errors;
    }
});

module.exports = OnlyNumberValidator;