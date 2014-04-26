var Base = require('./base');
var dimensionTypes = require('./dimensions');

var nodes = {};

nodes.StatementNode = Base.extend({
  initialize: function(expression) {
    this.expression = expression;
  },

  evaluate: function(dimensions) {
    if (this.expression == null) {
      return null;
    }

    return this.expression.evaluate(dimensions);
  }
});

nodes.GetDimensionNode = Base.extend({
  initialize: function(name) {
    this.name = name;
  },

  evaluate: function(dimensions) {
    if (!dimensions.have(this.name)) {
      throw new ReferenceError('Unknown IDENTIFIER ' + this.name);
    }

    return dimensions.get(this.name);
  }
});

nodes.FeetNode = Base.extend({
  initialize: function(value) {
    this.feet = new dimensionTypes.Feet(parseFloat(value));
  },

  evaluate: function(dimensions) {
    return this.feet;
  }
});

nodes.InchesNode = Base.extend({
  initialize: function(value) {
    this.inches = new dimensionTypes.Inches(parseFloat(value));
  },

  evaluate: function(dimensions) {
    return this.inches;
  }
});

nodes.FeetInchesNode = Base.extend({
  initialize: function(feet, inches) {
    this.feetInches = new dimensionTypes.FeetInches(
      parseFloat(feet),
      parseFloat(inches)
    );
  },

  evaluate: function(dimensions) {
    return this.feetInches;
  }
});

nodes.OperationNode = Base.extend({
  initialize: function(left, right) {
    this.left = left;
    this.right = right;
  },

  evaluate: function(dimensions) {
    var left = this.left.evaluate(dimensions);
    var newDimension = left[this.operation].call(left, this.right.evaluate(dimensions));
    return newDimension;
  }
});

nodes.EqualityOperationNode = Base.extend({
  initialize: function(left, right, not) {
    this.left = left;
    this.right = right;
    this.not = not;
  },

  evaluate: function(dimensions) {
    var left = this.left.evaluate(dimensions);
    var result = left[this.operation].call(left, this.right.evaluate(dimensions), this.not);
    return result;
  }
});

nodes.MultiplicationNode = nodes.OperationNode.extend({ operation: 'multiplyBy' });
nodes.DivisionNode       = nodes.OperationNode.extend({ operation: 'divideBy' });
nodes.AdditionNode       = nodes.OperationNode.extend({ operation: 'add' });
nodes.SubtractionNode    = nodes.OperationNode.extend({ operation: 'subtract' });
nodes.EqualityNode       = nodes.EqualityOperationNode.extend({ operation: 'equal' });
nodes.GreaterThanNode    = nodes.EqualityOperationNode.extend({ operation: 'greaterThan' });
nodes.LessThanNode       = nodes.EqualityOperationNode.extend({ operation: 'lessThan' });

module.exports = nodes;
