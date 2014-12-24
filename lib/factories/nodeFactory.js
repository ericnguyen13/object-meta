'use strict';

var constants = require('../constants/constants');
var Node = require('./node');

function NodeFactory(){
}

NodeFactory.prototype.create = function(nodeCreatingOption){
    return new Node(nodeCreatingOption);
};

NodeFactory.prototype.listSupportingTypes = function(){
    var types = [];
    for(var type in constants.Types){
        types.push(constants.Types[type]);
    }

    return types;
};

NodeFactory.prototype.listSupportingDisplayTypes = function(){
    var displayTypes = [];
    for(var type in constants.DisplayTypes){
        displayTypes.push(constants.DisplayTypes[type]);
    }
    return displayTypes;
};

module.exports = new NodeFactory();