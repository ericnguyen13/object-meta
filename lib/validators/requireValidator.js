'use strict';
var assign = require('object-assign');
var Validator = require('./validator');

/*
 * String should not be empty Validator.
 * */
var RequireRule = assign(Validator, {
    validate: function(value) {
        var hasValue, isValid;
        this.errors = [];
        isValid = true;
        if ((this.decoratedValidator != null)) {
            isValid = this.decoratedValidator.validate(value);
        }
        hasValue = value !== null && value !== void 0 && value !== "";
        if (!hasValue) {
            this.errors.push("The value is required");
        }
        return isValid && hasValue;
    },
    getErrors: function() {
        if ((this.decoratedValidator != null) && this.decoratedValidator !== void 0) {
            this.errors = this.decoratedValidator.getErrors().concat(this.errors);
        }
        return this.errors;
    }
});

module.exports = RequireRule;