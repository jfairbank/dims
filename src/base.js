var utils = require('./utils');

var Base = function() {
  if (this.initialize) {
    this.initialize.apply(this, arguments);
  }
};

// Adapted from Backbone.js
Base.extend = function(protoProps) {
  var parent = this;
  var child;

  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    child = function() { return parent.apply(this, arguments); };
  }

  utils.objectExtend(child, parent);

  var Ctor = function() { this.constructor = child; };
  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();

  if (protoProps) {
    utils.objectExtend(child.prototype, protoProps);
  }

  return child;
};

module.exports = Base;
