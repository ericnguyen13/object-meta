'use strict';
var assign = require('object-assign');
var Validator = require('./validator');

/*
 *    At least one item in array Validator.
 */
var AtLeastOneItemValidator = assign(Validator, {
    validate: function(items) {
        var hasItems, isValid, isValueValid, message;
        this.errors = [];
        isValid = true;
        if (this.items != null) {
            isValid = this.decoratedValidator.validate(items);
        }
        message = "The value is not an array or contains no items in it";
        isValueValid = items !== null && items !== void 0 && items.constructor === Array;
        if (!isValueValid) {
            this.errors.push(message);
            return false;
        }
        hasItems = items.length > 0;
        if (!hasItems) {
            this.errors.push(message);
        }
        return isValid && hasItems;
    },
    getErrors: function() {
        if ((this.decoratedValidator != null) && this.decoratedValidator !== void 0) {
            this.errors = this.decoratedValidator.getErrors().concat(this.errors);
        }
        return this.errors;
    }
});

module.exports = AtLeastOneItemValidator;