'use strict';
var Validator = require('./validator');
var _extends = require('../TypeInheritance');
_extends(DisplayValidator, Validator);
function DisplayValidator(){
    DisplayValidator.__super__.constructor.apply(this, arguments);
}

DisplayValidator.prototype.validate = function() {
    var isValid, n, node, nodeValue, object, operation, property, value, _i, _len, _ref;
    isValid = true;
    if ((this.isValid != null)) {
        isValid = this.decoratedValidator.validate();
    }
    property = this.options.property;
    value = (this.options.value != null) && this.options.value !== void 0 ? this.options.value.toString() : "";
    operation = this.options.operation;
    object = this.options.object;
    if ((object === null || object === void 0) || (operation !== "=" && operation !== "<" && operation !== ">")) {
        return false;
    }
    node = null;
    _ref = object.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (n.name === property) {
            node = n;
            break;
        }
    }
    if (node === null) {
        return false;
    }
    nodeValue = (node.value != null) && node.value !== void 0 ? node.value.toString() : "";
    if (operation === ">") {
        return isValid && nodeValue > value;
    } else if (operation === "<") {
        return isValid && nodeValue < value;
    }

    return{
        isValid: isValid && nodeValue === value,
        errors: this.decoratedValidator ? this.decoratedValidator.errors.concat(this.errors) : this.errors
    };
};

module.exports = DisplayValidator;