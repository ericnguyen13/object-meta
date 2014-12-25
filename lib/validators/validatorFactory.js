'use strict';

var Validators = require('../constants/constants').Validators;
var TypeChecker = require('../TypeChecker');

var defaultValidator = require('./validator');
var atLeastOneItemValidator = require('./atLeastOneItemValidator');
var displayValidator = require('./displayValidator');
var inRangeValidator = require('./inRangeValidator');
var noSpacingValidator = require('./noSpacingValidator');
var onlyNumberValidator = require('./onlyNumberValidator');
var regularExpressionValidator = require('./regularExpressionValidator');
var requireValidator = require('./requireValidator');

function _createValidatorMetaOption(name){
    switch (name){
        case Validators.DisplayValidator:
            return {
                object: void 0,
                property: "",
                operation: "=",
                value: void 0
            };
        case Validators.InRangeValidator:
            return {
                min: 0,
                max: 2147483647
            };
        case Validators.RegularExpressionValidator:
            return {
                pattern: "",
                flags: "gmi"
            };
        default:
            return {};
    }
};

/*
* private create validator based on the validator meta.
* */
function _createValidator(metaValidator){
    var validator = new defaultValidator();
    if (metaValidator && metaValidator.name && metaValidator.name !== ""){
        switch (metaValidator.name){
            case Validators.DisplayValidator:
                validator = new displayValidator(null, metaValidator.options || _createValidatorMetaOption(metaValidator.name));
                return validator;
            case Validators.InRangeValidator:
                validator = new inRangeValidator(null, metaValidator.options || _createValidatorMetaOption(metaValidator.name));
                return validator;
            case Validators.NoSpacingValidator:
                validator = new noSpacingValidator(null, metaValidator.options || _createValidatorMetaOption(metaValidator.name));
                return validator;
            case Validators.OnlyNumberValidator:
                validator = new onlyNumberValidator(null, metaValidator.options || _createValidatorMetaOption(metaValidator.name));
                return validator;
            case Validators.RegularExpressionValidator:
                validator = new regularExpressionValidator(null, metaValidator.options || _createValidatorMetaOption(metaValidator.name));
                return validator;
            case Validators.RequireValidator:
                validator = new requireValidator(null, metaValidator.options || _createValidatorMetaOption(metaValidator.name));
                return validator;
            case Validators.AtLeastOneItemValidator:
                validator = new atLeastOneItemValidator(null, metaValidator.options || _createValidatorMetaOption(metaValidator.name));
                return validator;
        }
    }

    return validator;
};

/*
* Validator Factory Constructor.
* */
function ValidatorFactory() {
}

/*
*  User this function to create decorating validator with decorated validators pattern.
* */
ValidatorFactory.prototype.buildDecoratingRuntimeValidator = function(metaValidators) {
    var decoratedValidator = null;

    /* Decorating all the validators from the meta validators array. */
    if (TypeChecker.isArray(metaValidators)){
        for(var i = metaValidators.length - 1; i >= 0; i--){
            var metaValidator = metaValidators[i];
            var newDecoratedValidator = _createValidator(metaValidator);
            newDecoratedValidator.decoratedValidator = decoratedValidator;
            decoratedValidator = newDecoratedValidator;
        }
    }else{
        decoratedValidator = _createValidator(metaValidators);
    }

    return decoratedValidator;
};

/*
* Provides a common way to create validator options for UI.
* */
ValidatorFactory.prototype.createValidatorMetaOption = function(name){
    return _createValidatorMetaOption(name);
};

/*
* List all the supporting validators of the object meta system.
* */
ValidatorFactory.prototype.listSupportingValidators = function() {
    var validators = [];

    for(var property in Validators){
        validators.push(Validators[property]);
    }

    return validators;
};

/*
 * Export the singleton validator factory to create
 * the decorated runtime validator pattern to
 * use to validate the input value.
 * */
module.exports = new ValidatorFactory();
