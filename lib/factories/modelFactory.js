'use strict';

var Types = require('../constants/constants').Types;
var clone = require('clone');
var TypeChecker = require('../TypeChecker');
var assign = require('object-assign');

function _toBoolean(value) {
    if ((value != null) && value !== void 0) {
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        } else {
            return value;
        }
    }
    return false;
};

function _toNumber(value) {
    if ((value != null) && value !== void 0) {
        return parseFloat(value);
    }
    return 0;
};

function _toString(value) {
    if ((value != null) && value !== void 0) {
        return value.toString();
    }
    return "";
};

function _correctCopyValue(node, model) {
    if (model === null || model === void 0 || TypeChecker.isFunction(model)) {
        node.value = node.type.options.defaultValue;
    } else if (TypeChecker.isObject(model)) {
        node.value = model.hasOwnProperty(node.name) ? model[node.name] : node.type.options.defaultValue;
    } else {
        node.value = model;
    }
    return _convertToCorrectTypeValue.call(this, node);
};

function _convertToCorrectTypeValue (node) {
    var oi, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    if (node === null || node === void 0) {
        return null;
    }
    switch (node.type.name) {
        case Types.Boolean:
            if ((node.type.options != null) && node.type.options !== void 0) {
                if ((node.type.options.items != null) && node.type.options.items !== void 0 && TypeChecker.isArray(node.type.options.items)) {
                    _ref = node.type.options.items;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        oi = _ref[_i];
                        if (TypeChecker.isObject(oi)){
                            oi.value = _toBoolean(oi.value);
                        }else{
                            _ref[_i] = _toBoolean(oi);
                        }
                    }
                }
            }
            return node.value = _toBoolean(node.value);
        case Types.String:
            if ((node.type.options != null) && node.type.options !== void 0) {
                if ((node.type.options.items != null) && node.type.options.items !== void 0 && TypeChecker.isArray(node.type.options.items)) {
                    _ref1 = node.type.options.items;
                    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                        oi = _ref1[_j];
                        if (TypeChecker.isObject(oi)){
                            oi.value = _toString(oi.value);
                        }else{
                            _ref1[_j] = _toString(oi);
                        }
                    }
                }
            }
            return node.value = _toString(node.value);
        case Types.Byte:
        case Types.Integer16:
        case Types.Integer32:
        case Types.Integer64:
            if ((node.type.options != null) && node.type.options !== void 0) {
                if ((node.type.options.items != null) && node.type.options.items !== void 0 && TypeChecker.isArray(node.type.options.items)) {
                    _ref2 = node.type.options.items;
                    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                        oi = _ref2[_k];
                        if (TypeChecker.isObject(oi)){
                            oi.value = _toNumber(oi.value);
                        }else{
                            _ref2[k] = _toNumber(oi);
                        }
                    }
                }
            }
            return node.value = _toNumber(node.value);
        default:
            return node.value = node.value;
    }
};

function ModelFactory() {
}

ModelFactory.prototype.toUiModel = function (node, jsonModel) {
    var index, itemNode, itemObj, model, n, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    model = {};
    model["name"] = node.name;
    model["label"] = node.label;
    model["type"] = {
        name: node.type.name,
        displayTypeName: node.type.displayTypeName,
        options: clone(node.type.options, false)
    };
    model["displayValidators"] = clone(node.displayValidators, false);
    model["validators"] = clone(node.validators, false);
    model["nodes"] = [];
    if (node.type.name === Types.Array) {
        model["items"] = [];
        _ref = node.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            n = _ref[_i];
            model["nodes"].push(this.toUiModel.call(this, n, null));
        }
        if ((jsonModel != null) && jsonModel.length > 0) {
            index = 0;
            if (node.nodes.length > 1) {
                itemNode = {
                    name: node.name,
                    type: {
                        name: Types.Object
                    },
                    nodes: clone(node.nodes, false)
                };
            } else {
                itemNode = node.nodes[0];
            }
            for (_j = 0, _len1 = jsonModel.length; _j < _len1; _j++) {
                itemObj = jsonModel[_j];
                itemNode.label = node.name + " item " + (model["items"].length + 1);
                model["items"].push(this.toUiModel.call(this, itemNode, jsonModel[index]));
                index++;
            }
        }
    } else if (node.type.name === Types.Object) {
        _ref1 = node.nodes;
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            n = _ref1[_k];
            model["nodes"].push(this.toUiModel.call(this, n, (jsonModel !== void 0 && (jsonModel != null) ? jsonModel[n.name] : null)));
        }
    } else {
        _correctCopyValue.call(this, model, jsonModel);
    }
    return model;
};

ModelFactory.prototype.toModel = function (node) {
    var item, model, _i, _j, _len, _len1, _ref, _ref1;
    model = null;
    if (node.type.name !== Types.Array && node.type.name !== Types.Object) {
        model = node.value;
    } else if (node.type.name === Types.Object) {
        model = {};
        _ref = node.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            model[node.name] = this.toModel.call(this, node);
        }
    } else if (node.type.name === Types.Array) {
        model = [];
        _ref1 = node.items;
        if (_ref1.length > 0) {
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                item = _ref1[_j];
                model.push(this.toModel.call(this, item));
            }
        } else {
            // Create a first default item in array.
            if (node.nodes.length >= 1){
                item = node.nodes.length > 1 ? {
                    type: {
                        name: Types.Object
                    },
                    displayValidators: clone(node.displayValidators, false),
                    validators: clone(node.validators, false),
                    nodes: clone(node.nodes, false),
                    name: node.name,
                    label: node.label
                }: clone(node.nodes[0], false);
                model.push(this.toModel.call(this, item));
            }
        }
    } else {
        throw new Error("Type was not supported");
    }
    return model;
};

module.exports = assign(new ModelFactory(), {});