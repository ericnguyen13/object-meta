'use strict';
var Validator = require('./validator');
var _extends = require('../TypeInheritance');
_extends(RegularExpressionValidator, Validator);
function RegularExpressionValidator(){
    RegularExpressionValidator.__super__.constructor.apply(this, arguments);
}

RegularExpressionValidator.prototype.validate = function(value) {
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

    return {
        isValid: isValid && isMatch,
        errors: this.decoratedValidator ? this.decoratedValidator.errors.concat(this.errors) : this.errors
    };
};

module.exports = RegularExpressionValidator;