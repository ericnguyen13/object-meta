'use strict';
var Validator = require('./validator');
var _extends = require('../TypeInheritance');
_extends(AtLeastOneItemValidator, Validator);
function AtLeastOneItemValidator(){
    AtLeastOneItemValidator.__super__.constructor.apply(this, arguments);
}

AtLeastOneItemValidator.prototype.validate = function(items) {
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
    return{
        isValid: isValid && hasItems,
        errors: this.decoratedValidator ? this.decoratedValidator.errors.concat(this.errors) : this.errors
    };
};

module.exports = AtLeastOneItemValidator;