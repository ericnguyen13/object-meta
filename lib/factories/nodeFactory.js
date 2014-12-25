'use strict';

var constants = require('../constants/constants');
var Node = require('./node');

function NodeFactory(){
}

/*
* Create a new node with the node's properties and prototype with
* this node we can use it to add a child node, a validator,
* and a display validator and so on.
* */
NodeFactory.prototype.create = function(nodeCreatingOption){
    return new Node(nodeCreatingOption);
};

/*
* List all the supporting types of the object meta system.
* */
NodeFactory.prototype.listSupportingTypes = function(){
    var types = [];
    for(var type in constants.Types){
        types.push(constants.Types[type]);
    }

    return types;
};

/*
* List all the supporting display types of the object meta system.
* */
NodeFactory.prototype.listSupportingDisplayTypes = function(){
    var displayTypes = [];
    for(var type in constants.DisplayTypes){
        displayTypes.push(constants.DisplayTypes[type]);
    }
    return displayTypes;
};

/*
* Export the singleton node factory to create
* a node and only this node factory can create the
* node.
* */
module.exports = new NodeFactory();