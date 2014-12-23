'use strict';

module.exports = {
    Types: {
        Object: "Object",
        Array: "Array",
        Boolean: "Boolean",
        String: "String",
        Integer16: "Integer16",
        Integer32: "Integer32",
        Integer64: "Integer64",
        Float: "Float",
        Double: "Double",
        Byte: "Byte"
    },
    Validators: {
        None: "None",
        AtLeastOneItemValidator: "Contains At Least One Item",
        DisplayValidator: "Display Validator",
        InRangeValidator: "In Range Validator",
        NoSpacingValidator: "No Spacing Validator",
        OnlyNumberValidator: "Only Number Validator",
        RegularExpressionValidator: "Regular Expression Validator",
        RequireValidator: "Require Validator"
    },
    DisplayTypes: {
        Text: "Text",
        TextArea: "TextArea",
        RadioButton: "RadioButton",
        CheckBox: "CheckBox",
        ComboBox: "ComboBox",
        List: "List"
    }
};