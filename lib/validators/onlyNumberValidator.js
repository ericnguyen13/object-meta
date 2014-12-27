'use strict';
var Validator = require('./validator');
var _extends = require('../TypeInheritance');
_extends(OnlyNumberValidator, Validator);
function OnlyNumberValidator(){
    OnlyNumberValidator.__super__.constructor.apply(this, arguments);
}

OnlyNumberValidator.prototype.validate = function(value) {
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
    return{
        isValid: isValid && isNumber,
        errors: this.decoratedValidator ? this.decoratedValidator.errors.concat(this.errors) : this.errors
    };
};

module.exports = OnlyNumberValidator;