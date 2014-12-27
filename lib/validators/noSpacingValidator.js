'use strict';
var Validator = require('./validator');
var _extends = require('../TypeInheritance');
_extends(NoSpacingValidator, Validator);
function NoSpacingValidator(){
    NoSpacingValidator.__super__.constructor.apply(this, arguments);
}

NoSpacingValidator.prototype.validate = function(value) {
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
    return{
        isValid: isValid && hasNoSpace,
        errors: this.decoratedValidator ? this.decoratedValidator.errors.concat(this.errors) : this.errors
    };
};

module.exports = NoSpacingValidator;