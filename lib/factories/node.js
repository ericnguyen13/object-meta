'use strict';

var _ = require('lodash');
var clone = require('clone');
var Types = require('../constants/constants').Types;
var DisplayTypes = require('../constants/constants').DisplayTypes;
var TypeChecker = require('../TypeChecker');
var NodeType = require('./nodeType');
var ValidatorFactory = require('../validators/validatorFactory');

/*
* Generate the unique key.
* */
function _generateKey(){
    var s4;
    s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function _toBoolean(value) {
    if (value) {
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        } else {
            return value;
        }
    }
    return false;
}
function _toDecimal(value) {
    if (value) {
        return parseFloat(value);
    }

    return 0.0;
}
function _toWholeNumber(value){
    if (value){
        return parseInt(value);
    }

    return 0;
}
function _toString(value) {
    if (value) {
        return value.toString();
    }
    return "";
}
function _correctTypeData(node, converter){
    if (node){
        node.value = converter(node.value);
        if (node.type && node.type.options){
            _.forEach(node.type.options.items, function(item){
                item.value = converter(item.value);
            });
        }
    }
}
function _correctNodeData(node){
    if (node && node.type){
        switch (node.type.name){
            case Types.Boolean:
                _correctTypeData(node, _toBoolean);
                break;
            case Types.Byte:
            case Types.Integer16:
            case Types.Integer32:
            case Types.Integer64:
                _correctTypeData(node, _toWholeNumber);
                break;
            case Types.Double:
            case Types.Float:
                _correctTypeData(node, _toDecimal);
                break;
            case Types.String:
                _correctTypeData(node, _toString);
                break;
        }
    }
}
function _toUiNode(root, json){
    if (root.type.typeName === Types.Object){
        _.forEach(root.nodes, function(node){
            _toUiNode(node, json ? json[node.name] : null);
        });
    } else if (root.type.typeName === Types.Array){
        root.items = [];
        if (TypeChecker.isArray(json) && TypeChecker.isArray(root.nodes) && root.nodes.length > 0) {
            var itemNode = root.nodes.length > 1 ? new Node({
                name: root.name,
                type: new NodeType({
                    typeName: Types.Object,
                    displayTypeName: DisplayTypes.Text
                }),
                nodes: root.nodes
            }): root.nodes[0];
            for (var _j = 0, _len1 = json.length; _j < _len1; _j++) {
                var jsonItem = json[_j];
                itemNode.label = root.name + " item " + (root.items.length + 1);
                root.items.push(_toUiNode(itemNode, jsonItem));
            }
        }
    }else{
        root.value = json;
        _correctNodeData(root);
    }

    return root;
}
function _toJson(root){
    var item, model;
    model = {};
    if (root.type.typeName !== Types.Array && root.type.typeName !== Types.Object) {
        model = root.value;
    } else if (root.type.typeName === Types.Object) {
        _.forEach(root.nodes, function(node){
            model[node.name] = _toJson(node);
        })
    } else if (root.type.typeName === Types.Array) {
        model = [];
        _.forEach(root.items, function(item){
            model.push(_toJson(item));
        });

        /* Create one default item for an array type. */
        if (model.length == 0){
            item = root.nodes.length > 1 ? {
                type: {
                    typeName: Types.Object
                },
                displayValidators: root.displayValidators,
                validators: root.validators,
                nodes: root.nodes,
                name: root.name,
                label: root.label
            }: root.nodes[0];
            model.push(_toJson(item));
        }
    } else {
        throw new Error("Type was not supported");
    }

    return model;
}
function _cloneNodes(originalNodes){
    var nodes = [];
    if (TypeChecker.isArray(originalNodes)){
        _.forEach(originalNodes, function(node){
            /** If the children is already Node type, go ahead and clone it, otherwise null the Node up. **/
            nodes.push(node.constructor === "Node" ? node.clone() : new Node(node));
        });
    }

    return nodes;
}
/*
* Node constructor, use this to null up the node.
* */
function Node(nodeCreatingOption){
    var options = nodeCreatingOption || {};
    this.key =  nodeCreatingOption.key || _generateKey();
    this.parent = options.parent || "";
    this.name = options.name || "object";
    this.label = options.label || "object name";
    this.type =  new NodeType({
        typeName: options.type ? options.type.typeName : Types.String,
        displayTypeName: options.type ? options.type.displayTypeName : DisplayTypes.Text,
        options: options.type && options.type.options ? options.type.options : {defaultValue: null, items: []}
    });

    this.displayValidators = [];
    if (options.displayValidators && options.displayValidators.length > 0){
        options.displayValidators.forEach(function(item){
            this.displayValidators.push(clone(item));
        }.bind(this));
    }

    this.validators = [];
    if (options.validators && options.validators.length > 0){
        options.validators.forEach(function(item){
            this.validators.push(clone(item));
        }.bind(this));
    }

    this.nodes = _cloneNodes(nodeCreatingOption.nodes);
}

Node.prototype.clone = function(){
    return new Node({
        key: this.key,
        parent: this.parent,
        name: this.name,
        label: this.label,
        type: this.type.clone(),
        displayValidators: this.displayValidators,
        validators: this.validators,
        nodes: _cloneNodes(this.nodes)
    });
};

/*
* Change node type(or object type).
* */
Node.prototype.changeType = function(options){
    this.type = new NodeType({
        typeName: options && options.typeName ? options.typeName : Types.String,
        displayTypeName: options && options.displayTypeName ? options.displayTypeName : DisplayTypes.Text,
        options: options && options.options ? options.options : {defaultValue: null, items: []}
    });

    return this.type;
};

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
    if (node && node.constructor === Node && node.type &&
        (this.type.typeName === Types.Object || this.type.typeName === Types.Array) &&
        !_.find(this.nodes, function(n){ return n.key === node.key; })) {
        node.parent = this.key;
        this.nodes.push(node);
        return node;
    }

    return node;
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
    if (validatorOption && validatorOption.name && validatorOption.name !== ""){
        if (!_.find(this.validators, { name: validatorOption.name })){
            this.validators.push({
                name: validatorOption.name,
                options: validatorOption.options || ValidatorFactory.createValidatorMetaOption(validatorOption.name)
            });
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
        displayValidatorOption.name !== ""){
        this.displayValidators.push({
            name: displayValidatorOption.name,
            options: displayValidatorOption.options || ValidatorFactory.createValidatorMetaOption(displayValidatorOption.name)
        });
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
Node.prototype.runValidators = function(){
    if (TypeChecker.isArray(this.validators)){
        var decoratedValidator = ValidatorFactory.buildDecoratingRuntimeValidator(this.validators);
        return decoratedValidator ? decoratedValidator.validate() : {
            isValid: true,
            errors: []
        };
    }

    /* always return valid if there was no validators. */
    return {
        isValid: true,
        errors: []
    };
};

/*
* Execute all the display validators and compile all the errors if there was any.
* */
Node.prototype.runDisplayValidators = function(){
    if (TypeChecker.isArray(this.displayValidators)){
        var decoratedValidator = ValidatorFactory.buildDecoratingRuntimeValidator(this.displayValidators);
        return decoratedValidator ? decoratedValidator.validate() : {
            isValid: true,
            errors: []
        };
    }

    /* always return valid if there was no display validators. */
    return {
        isValid: true,
        errors: []
    };
};

/*
* Create the ui model from model meta and real model value.
* */
Node.prototype.toUiModel = function(json){
    return _toUiNode(this.clone(), json);
};

/*
* Stringify the ui model to json model.
* */
Node.prototype.toModel = function(){
    return _toJson(this);
};

module.exports = Node;