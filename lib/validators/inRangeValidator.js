'use strict';
var Validator = require('./validator');
var _extends = require('../TypeInheritance');
_extends(InRangeValidator, Validator);
function InRangeValidator(){
    InRangeValidator.__super__.constructor.apply(this, arguments);
}

InRangeValidator.prototype.validate = function(value) {
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
    return{
        isValid: isValid && isGreaterMin && isSmallerMax,
        errors: this.decoratedValidator ? this.decoratedValidator.errors.concat(this.errors) : this.errors
    };
};

module.exports = InRangeValidator;