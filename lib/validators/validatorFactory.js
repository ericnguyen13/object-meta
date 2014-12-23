'use strict';

var assign = require('object-assign');
var constants = require('../constants/constants');

var defaultValidator = require('./validator');
var atLeastOneItemValidator = require('./atLeastOneItemValidator');
var displayValidator = require('./displayValidator');
var inRangeValidator = require('./inRangeValidator');
var noSpacingValidator = require('./noSpacingValidator');
var onlyNumberValidator = require('./onlyNumberValidator');
var regularExpressionValidator = require('./regularExpressionValidator');
var requireValidator = require('./requireValidator');


function _createValidator(metaValidator){
    var validator = new defaultValidator();
    if (metaValidator && metaValidator.name && metaValidator.name !== ""){
        switch (metaValidator.name){
            case Validators.DisplayValidator:
                validator = new displayValidator(null, assign({
                    object: void 0,
                    property: "",
                    operation: "=",
                    value: void 0
                }, metaValidator.options || {}));
                return validator;
            case Validators.InRangeValidator:
                validator = new inRangeValidator(null, assign({
                    min: 0,
                    max: 2147483647
                }, metaValidator.options || {}));
                return validator;
            case Validators.NoSpacingValidator:
                validator = new noSpacingValidator(null, {});
                return validator;
            case Validators.OnlyNumberValidator:
                validator = new onlyNumberValidator(null, {});
                return validator;
            case Validators.RegularExpressionValidator:
                validator = new regularExpressionValidator(null, assign({
                    pattern: "",
                    flags: "gmi"
                }, metaValidator.options || {}));
                return validator;
            case Validators.RequireValidator:
                validator = new requireValidator(null, {});
                return validator;
            case Validators.AtLeastOneItemValidator:
                validator = new atLeastOneItemValidator(null, {});
                return validator;
        }
    }

    return validator;
};

function ValidatorFactory() {
}

/*
*  User this function to create validator with decorated validators pattern.
* */
ValidatorFactory.prototype.decorateRuntimeValidator = function(metaValidators) {
    var decoratedValidator = null;

    /* Decorating all the validators in the meta validators array. */
    if (metaValidators.constructor === Array){
        for(var i = metaValidators.length - 1; i >= 0; i--){
            var metaValidator = metaValidators[i];
            var newDecoratedValidator = _createValidator(metaValidator);
            newDecoratedValidator.decoratedValidator = decoratedValidator;
            decoratedValidator = newDecoratedValidator;
        }
    }

    return decoratedValidator;
};

/*
* List all supporting validators.
* */
ValidatorFactory.prototype.listSupportingValidators = function() {
    var validators = [];

    for(var property in constants.Validators){
        validators.push(constants.Validators[property]);
    }

    return validators;
};

module.exports = ValidatorFactory;
