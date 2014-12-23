'use strict';
var assign = require('object-assign');
var Validator = require('./validator');

/*
 * Range Validator.
 * */
var InRangeValidator = assign(Validator, {
    validate: function(value) {
        var isGreaterMin, isNumber, isSmallerMax, isValid, isValidValue, errorMessage, number;
        this.errors = [];
        isValid = true;

        // Execute the decorated rule chain.
        if ((this.decoratedValidator != null)) {
            isValid = this.decoratedValidator.validate(value);
        }
        errorMessage = "The value must be in range " + this.options.min + " to " + this.options.max;
        isValidValue = value !== null && value !== void 0 && value !== "";
        if (!isValidValue) {
            this.errors.push(errorMessage);
            return false;
        }
        isNumber = /^\d+$/.test(value);
        if (!isNumber) {
            this.errors.push(errorMessage);
            return false;
        }
        number = parseInt(value);
        isGreaterMin = number >= this.options.min;
        isSmallerMax = number <= this.options.max;
        if (!isGreaterMin || !isSmallerMax) {
            this.errors.push(errorMessage);
        }
        return isValid && isGreaterMin && isSmallerMax;
    },
    getErrors: function() {
        if ((this.decoratedValidator != null) && this.decoratedValidator !== void 0) {
            this.errors = this.decoratedValidator.getErrors().concat(this.errors);
        }
        return this.errors;
    }
});

module.exports = InRangeValidator;