'use strict';
var assign = require('object-assign');
var Validator = require('./validator');

/*
 * Not allow spacing Validator.
 * */
var NoSpacingRule = assign(Validator, {
    validate: function(value) {
        var hasNoSpace, isValid, isValueValid, message;
        this.errors = [];
        isValid = true;
        if ((this.decoratedValidator != null)) {
            isValid = this.decoratedValidator.validate(value);
        }
        message = "Spacing is not allowed";
        isValueValid = value !== null && value !== void 0 && value !== "";
        if (!isValueValid) {
            this.errors.push(message);
            return false;
        }
        hasNoSpace = value.indexOf(' ') < 0;
        if (!hasNoSpace) {
            this.errors.push(message);
        }
        return isValid && hasNoSpace;
    },
    getErrors: function() {
        if ((this.decoratedValidator != null) && this.decoratedValidator !== void 0) {
            this.errors = this.decoratedValidator.getErrors().concat(this.errors);
        }
        return this.errors;
    }
});

module.exports = NoSpacingRule;