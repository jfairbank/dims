var Base           = require('./base'),
    dimensionTypes = require('./dimensions'),
    parser         = require('./parser'),
    utils          = require('./utils');

// Helpers
// =======
var floatValue = function(value) {
  return parseFloat(value) || 0;
};

var ensureFloat = function(fn) {
  return function(name) {
    var values = utils.map(utils.slice(arguments, 1), floatValue);
    values.unshift(name);
    return fn.apply(this, values);
  };
};

// Parsed
// ======
var Parsed = Base.extend({
  initialize: function(expression, dimensions) {
    this._ast        = parser.parse(expression);
    this._dimensions = dimensions;
  },

  getAST: function() {
    return this._ast;
  },

  evaluate: function() {
    return this._ast.evaluate(this._dimensions);
  },

  evaluateToValue: function() {
    return this.evaluate().value;
  },

  evaluateToFeetValue: function() {
    return this.evaluate().getFeetValue();
  },

  evaluateToInchesValue: function() {
    return this.evaluate().getInchesValue();
  }
});

// Dims
// ====
var Dims = Base.extend({
  initialize: function() {
    this._dimensions = new dimensionTypes.Dimensions();
  },

  //addDimension: function(name, feet, inches) {
    //this._dimensions.add(name, this._getDimensionToAdd(feet, inches));
  //},

  addFeet: ensureFloat(function(name, feet) {
    this._dimensions.add(name, new dimensionTypes.Feet(feet));
  }),

  updateFeet: ensureFloat(function(name, feet) {
    this._dimensions.update(name, new dimensionTypes.Feet(feet));
  }),

  addInches: ensureFloat(function(name, inches) {
    this._dimensions.add(name, new dimensionTypes.Inches(inches));
  }),

  updateInches: ensureFloat(function(name, inches) {
    this._dimensions.update(name, new dimensionTypes.Inches(inches));
  }),

  addFeetInches: ensureFloat(function(name, feet, inches) {
    this._dimensions.add(name, new dimensionTypes.FeetInches(feet, inches));
  }),

  updateFeetInches: ensureFloat(function(name, feet, inches) {
    this._dimensions.update(name, new dimensionTypes.FeetInches(feet, inches));
  }),

  parse: function(expression) {
    return new Parsed(expression, this._dimensions);
  }

  //_getDimensionToAdd: function(feet, inches) {
    //if (feet && inches) {
      //return new dimensionTypes.FeetInches(feet, inches);
    //} else if (feet) {
      //return new dimensionTypes.Feet(feet);
    //}

    //return new dimensionTypes.Inches(inches);
  //}
});

// Foward methods to `Parsed` object
// =================================
utils.each([
  'evaluate',
  'evaluateToValue',
  'evaluateToFeetValue',
  'evaluateToInchesValue'
], function(name) {
  this[name] = function(expression) {
    return this.parse(expression)[name]();
  };
}, Dims.prototype);

// API
// ===
var create = function() {
  return new Dims();
};

module.exports = create;
