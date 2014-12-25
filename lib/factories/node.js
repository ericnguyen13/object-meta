'use strict';

var _ = require('lodash');
var clone = require('clone');
var Types = require('../constants/constants').Types;
var DisplayTypes = require('../constants/constants').DisplayTypes;
var TypeChecker = require('../TypeChecker');
var ValidatorFactory = require('../validators/validatorFactory');
var ModelFactory = require('./modelFactory');
var assign = require('object-assign');

function _generateKey(){
    var s4;
    s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function Node(nodeCreatingOption){
    var options = nodeCreatingOption || {};
    this.key =  nodeCreatingOption.key || _generateKey();
    this.parent = options.parent || "";
    this.name = options.name || "object";
    this.label = options.label || "object name";
    this.type = nodeCreatingOption.type || {
        name: Types.Object,
        displayTypeName: DisplayTypes.Text,
        options: {
            defaultValue: void 0,
            items: []
        }
    };

    this.displayValidators = options.displayValidators ? clone(options.displayValidators) : [];
    this.validators = options.validators ? clone(options.validators) : [];
    this.nodes = options.nodes ? clone(options.nodes) : [];
}

/*
* Traverse the hierarchy node to find the node with
* the specified key (include the root node).
* */
Node.prototype.findNodeByKey = function(key){
    if (this.key === key){
        return this;
    }

    var node = null;
    for(var i = 0; i < this.nodes.length; i++){
        node = this.nodes[i].findNodeByKey(key);
        if (node){
            return node;
        }
    }

    return node;
};

/*
* Add a new node to the current node's children if there is no child
* with the same key exists in its child nodes.
* */
Node.prototype.addChildNode = function(node){
    if (node && node.constructor === Node &&
        !_.find(this.nodes, function(n){ return n.key === node.key; })){
        this.nodes.push(node);
        return node;
    }

    return null;
};

/*
* Remove a node from the child nodes if it can be found
* with the specified key.
* */
Node.prototype.removeChildNode = function(key){
    if (key){
        var index = _.findIndex(this.nodes, { key: key });
        if (index >= 0){
            this.nodes.splice(index, 1);
            return true;
        }else{
            for(var i = 0; i < this.nodes.length; i++){
                if (this.nodes[i].removeChildNode(key)){
                    return true;
                }
            }
        }
    }

    return false;
};

/*
* Add validator to validate the node's value.
* */
Node.prototype.addValidator = function(validatorOption){
    if (validatorOption && validatorOption.name &&
        validatorOption.name !== "" && validatorOption.options){
        if (!_.find(this.validators, { name: validatorOption.name })){
            this.validators.push(validatorOption);
        }
    }
};

/*
* Remove validator.
* */
Node.prototype.removeValidator = function(name){
    if (name && name !== ""){
        var index = _.findIndex(this.validators, { name: name });
        if (index >= 0){
            this.validators.splice(index, 1);
        }
    }
};

/*
* Add display validator in order to hide/show and its depends on other node's value.
* */
Node.prototype.addDisplayValidator = function(displayValidatorOption){
    if (displayValidatorOption && displayValidatorOption.name &&
        displayValidatorOption.name !== "" && displayValidatorOption.options){
        if (!_.find(this.displayValidators, { name: displayValidatorOption.name })){
            this.displayValidators.push(displayValidatorOption);
        }
    }
};

/*
* Remove display validator.
* */
Node.prototype.removeDisplayValidator = function(name){
    if (name && name !== ""){
        var index = _.findIndex(this.displayValidators, { name: name });
        if (index >= 0){
            this.displayValidators.splice(index, 1);
        }
    }
};

/*
* Execute all the validators and compile all the errors if there was any.
* */
Node.prototype.executeValidators = function(){
    if (TypeChecker.isArray(this.validators)){
        var decoratedValidator = ValidatorFactory.buildDecoratingRuntimeValidator(this.validators);
        return {
            valid: decoratedValidator.validate(),
            errors: decoratedValidator.getErrors()
        };
    }

    /* always return valid if there was no validators. */
    return {
        valid: true,
        errors: []
    };
};

/*
* Execute all the display validators and compile all the errors if there was any.
* */
Node.prototype.executeDisplayValidators = function(){
    if (TypeChecker.isArray(this.validators)){
        var decoratedValidator = ValidatorFactory.buildDecoratingRuntimeValidator(this.displayValidators);
        return {
            valid: decoratedValidator.validate(),
            errors: decoratedValidator.getErrors()
        };
    }

    /* always return valid if there was no display validators. */
    return {
        valid: true,
        errors: []
    };
};

/*
* Create the ui model from model meta and real model value.
* */
Node.prototype.toUiModel = function(jsonObj){
    var uiModel = ModelFactory.toUiModel(this, jsonObj);
    return assign(uiModel, Node.prototype);
};

/*
* Stringify the ui model to json model.
* */
Node.prototype.toModel = function(){
    return ModelFactory.toModel(this);
};

module.exports = Node;