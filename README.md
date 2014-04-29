# dims

dims is a simple language for evaluating arithmetic and equality expressions of units of measurement. dims was born from working on an application that gathers dimensions in feet and inches and enforces constraints on those measurements. Because I had to work with both feet and inches, I had to perform a lot of conversions to the same unit for doing comparisons and arithmetic. Using custom types for feet, inches, and foot/inches is cumbersome without operator overloading, so dims allows the arithmetic and equality checks to be performed more expressively.

To best understand how it works, check out some examples below:

```javascript
  var dims = require('dims');  // global for browsers
  var d = dims();
  
  // Arithmetic
  // ==========

  // Add variables
  d.addFeet('x', 42);
  d.addInches('y', 9);
  d.addFeetInches('z', 3, 6);
  
  // Access the variables
  d.evaluateToFeetValue('x + y');  // 42.75
  d.evaluateToInchesValue('x');    // 504
  d.evaluteToFeet('z');            // 3.5
  
  // Use feet and inches literals
  d.evaluateToFeetValue('x - 2ft');        // 40
  d.evaluateToInchesValue('1ft + 3in');    // 15
  d.evaluateToFeetValue('3ft 2in + 2ft');  // 5.166..
  
  // Equality
  // ========
  
  d.evaluateToValue('x > y');       // true
  d.evaluateToValue('y < z < x');   // true
  d.evaluateToValue('42ft > x');    // false
  d.evaluateToValue('42ft >= x');   // true
  d.evaluateToValue('y = z');       // false, notice single "="
  d.evaluateToValue('y = 0.75ft');  // true
```

## Build

1. Install gulp with `npm install -g gulp`
2. Run `gulp` or `gulp parser` to build the parser.
3. Or, run `gulp browser` to build a copy for the web.

## More to come...
