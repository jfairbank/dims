var Base  = require('./base'),
    utils = require('./utils');

// Helpers
// =======
var feetToInches = function(feet) {
  return feet * 12;
};

var inchesToFeet = function(inches) {
  return inches / 12;
};

// Equality
// ========
var Equality = Base.extend({
  initialize: function(value, dimension, not) {
    if (typeof not == 'undefined' || not === null) {
      not = false;
    }

    this.value = not != value;
    this.dimension = dimension;
  },

  _equalityOperation: function(opName, rightDimension, not) {
    if (!this.value) {
      return false;
    }

    var eq = this.dimension[opName](rightDimension, not);
    return eq;
  }
});

utils.each(['equal', 'lessThan', 'greaterThan'], function(opName) {
  this[opName] = function(dimension, not) {
    return this._equalityOperation(opName, dimension, not);
  };
}, Equality.prototype);

// Unit
// ====
var Unit = Base.extend({
  initialize: function(value) {
    this.value = value;
  },

  getFeetValue: function() {
    return this.toFeet().value;
  },

  getInchesValue: function() {
    return this.toInches().value;
  },

  add: function(dimension) {
    return this._operation(this._add, dimension);
  },

  subtract: function(dimension) {
    return this._operation(this._subtract, dimension);
  },

  equal: function(dimension, not) {
    return this._equalityOperation(this._equal, dimension, not);
  },

  greaterThan: function(dimension, not) {
    return this._equalityOperation(this._greaterThan, dimension, not);
  },

  lessThan: function(dimension, not) {
    return this._equalityOperation(this._lessThan, dimension, not);
  },

  _add: function(left, right) {
    return left + right;
  },

  _subtract: function(left, right) {
    return left - right;
  },

  _equal: function(left, right) {
    return left === right;
  },

  _greaterThan: function(left, right) {
    return left > right;
  },

  _lessThan: function(left, right) {
    return left < right;
  },

  _compareSelf: function() {
    return this;
  },

  _asMe: function(dimension) {
    return dimension[this.typeCoercer]();
  },

  _compareDimension: function(dimension) {
    return this._asMe(dimension);
  },

  _newResult: function(value) {
    return new this.constructor(value);
  },

  _operation: function(fn, dimension) {
    return this._newResult(fn(this._compareSelf().value, this._compareDimension(dimension).value));
  },

  _equalityOperation: function(fn, dimension, not) {
    var result = fn(this._compareSelf().value, this._compareDimension(dimension).value);
    return new Equality(result, dimension, not);
  }
});

// Feet
// ====
var Feet = Unit.extend({
  typeCoercer: 'toFeet',

  display: function() {
    return this.value + "'";
  },

  toFeet: function() {
    return this;
  },

  toInches: function() {
    return new Inches(feetToInches(this.value));
  },

  toFeetInches: function() {
    return new FeetInches(this.value, 0);
  }
});

// Inches
// ======
var Inches = Unit.extend({
  typeCoercer: 'toInches',

  display: function() {
    return this.value + '"';
  },

  toFeet: function() {
    return new Feet(inchesToFeet(this.value));
  },

  toInches: function() {
    return this;
  },

  toFeetInches: function() {
    return new FeetInches(0, this.value);
  }
});

// FeetInches
// ==========
var FeetInches = Unit.extend({
  typeCoercer: 'toFeetInches',

  initialize: function(feet, inches) {
    this._balance(feet, inches);
  },

  display: function() {
    return this.feet + "'" + this.inches + '"';
  },

  toFeet: function() {
    return new Feet(this.feet + inchesToFeet(this.inches));
  },

  toInches: function() {
    return new Inches(feetToInches(this.feet) + this.inches);
  },

  toFeetInches: function() {
    return this;
  },

  _compareSelf: function() {
    return this.toInches();
  },

  _compareDimension: function(dimension) {
    return dimension.toInches();
  },

  _newResult: function(value) {
    return new FeetInches(0, value);
  },

  _balance: function(feet, inches) {
    var allFeet = feet + inchesToFeet(inches);
    this.feet = Math.floor(allFeet);
    this.inches = feetToInches(allFeet % 1);
  },
});

// Dimensions
// ==========
var Dimensions = Base.extend({
  initialize: function() {
    this._dimensions = {};
  },

  add: function(name, dimension) {
    this._dimensions[name] = dimension;
  },

  update: function(name, dimension) {
    if (!this.have(name)) {
      return this.add(name, dimension);
    }

    // Use the new dimension as the current dimension type
    this.add(name, this.get(name)._asMe(dimension));
  },

  have: function(name) {
    return this._dimensions.hasOwnProperty(name);
  },

  get: function(name) {
    return this._dimensions[name];
  }
});

exports.Feet       = Feet;
exports.Inches     = Inches;
exports.FeetInches = FeetInches;
exports.Dimensions = Dimensions;
