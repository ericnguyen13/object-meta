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
    this.options = {};
    this.displayTypeName = displayTypeName;
    switch (displayTypeName){
        case DisplayTypes.Text:
        case DisplayTypes.TextArea:
            this.options.defaultValue = _defaultValueFor(this.typeName);
            return this.options;
        case DisplayTypes.CheckBox:
        case DisplayTypes.ComboBox:
        case DisplayTypes.List:
        case DisplayTypes.RadioButton:
            this.options.defaultValue = _defaultValueFor(this.typeName);
            this.options.items = [];
            return this.options;
    }

    this.displayTypeName = DisplayTypes.Text;
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
        case Types.Object:
            return undefined;
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
    this.displayTypeName = "";
    this.typeName = options && _isTypeNameValid(options.typeName) ? options.typeName : Types.String;
    this.changeDisplayTypeName(options ? options.displayTypeName : DisplayTypes.Text);
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
        displayTypeName: this.displayTypeName,
        options: clone(this.options, false)
    });
};

module.exports = NodeType;


