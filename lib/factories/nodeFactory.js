'use strict';

var constants = require('../constants/constants');
var Node = require('./node');
var assign = require('object-assign');

function NodeFactory(){
}

NodeFactory.prototype.create = function(){
    return new Node();
};

NodeFactory.prototype.getTypes = function(){
    var types = [];
    for(var type in constants.Types){
        types.push(constants.Types[type]);
    }

    return types;
};

NodeFactory.prototype.getDisplayTypes = function(){
    var displayTypes = [];
    for(var type in constants.DisplayTypes){
        displayTypes.push(constants.DisplayTypes[type]);
    }
    return displayTypes;
};

module.exports = assign(new NodeFactory(), {});