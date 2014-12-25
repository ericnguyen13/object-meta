/**
 * Created by enguyen on 12/21/14.
 */

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
    return true;
};

Validator.prototype.getErrors = function(){
    return this.errors;
};

(function () {
    return Function.prototype.property = function (prop, desc) {
        return Object.defineProperty(this.prototype, prop, desc);
    };
})();

Validator.property("options", {
    get: function(){
        return this.options;
    },
    set: function(options){
        this.options = options || {};
    }
});

Validator.property("decoratedValidator", {
    get: function(){
        return this.decoratedValidator;
    },
    set: function(decoratedValidator){
        this.decoratedValidator = decoratedValidator;
    }
})

module.exports = Validator;
