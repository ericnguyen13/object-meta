'use strict';

/*
 *  Based Validator.
 */
function Validator(decoratedValidator, options){
    this.options = options;
    this.decoratedValidator = decoratedValidator;
    this.errors = [];
}

Validator.prototype.validate = function(){
    return {
        isValid: true,
        errors: this.errors
    };
};

module.exports = Validator;
