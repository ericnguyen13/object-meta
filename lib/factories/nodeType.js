'use strict';
var Constants = require('../constants/constants');
var Types = Constants.Types;
var DisplayTypes = Constants.DisplayTypes;
var clone = require('clone');

/*
* Change the display type and its options which
* contains default value and items for UI render.
* Item is the key and value pairs.
* */
function _changeDisplayTypeName(displayTypeName){
    this.options = {defaultValue: null, items: []};
    this.displayTypeName = _isTypeNameValid(displayTypeName) ? displayTypeName : DisplayTypes.Text;
    this.options.defaultValue = _defaultValueFor(this.typeName);
    return this.options;
}
/*
* Check if the object meta system supports the specified type.
* */
function _isTypeNameValid(typeName){
    for(var type in Types){
        if (typeName === type){
            return true;
        }
    }

    return false;
}
/*
* Provide the default value base on the type.
* */
function _defaultValueFor(typeName){
    switch (typeName){
        case Types.Boolean:
            return false;
        case Types.Array:
            return [];
        case Types.Object:
            return null;
        case Types.Byte:
        case Types.Integer16:
        case Types.Integer32:
        case Types.Integer64:
            return 0;
        case Types.Double:
        case Types.Float:
            return 0.0;
        case Types.String:
            return "";
    }

    return undefined;
}

/*
* Node type constructor.
* */
function NodeType(options){
    this.displayTypeName = options ? options.displayTypeName : DisplayTypes.Text;
    this.typeName = options && _isTypeNameValid(options.typeName) ? options.typeName : Types.String;
    if (options && options.options){
        this.options = clone(options.options, false);
    }else{
        this.changeDisplayTypeName(options ? options.displayTypeName : DisplayTypes.Text);
    }
}

NodeType.prototype.changeDisplayTypeName = function(displayTypeName){
    return _changeDisplayTypeName.call(this, displayTypeName);
};

NodeType.prototype.createDefaultValue = function(){
    return _defaultValueFor(this.typeName);
};

NodeType.prototype.clone = function(){
    return new NodeType({
        typeName: this.typeName,
        displayTypeName: _isTypeNameValid(this.displayTypeName) ? this.displayTypeName : DisplayTypes.Text,
        options: clone(this.options, false)
    });
};

module.exports = NodeType;


