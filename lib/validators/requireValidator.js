'use strict';
var Validator = require('./validator');
var _extends = require('../TypeInheritance');
_extends(RequireValidator, Validator);
function RequireValidator(){
    RequireValidator.__super__.constructor.apply(this, arguments);
}

/*
* Validate against the value.
* */
RequireValidator.prototype.validate = function(value) {
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
    return {
        isValid: isValid && hasValue,
        errors: this.decoratedValidator ? this.decoratedValidator.errors.concat(this.errors) : this.errors
    };
};

module.exports = RequireValidator;