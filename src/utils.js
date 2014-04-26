var __slice = Array.prototype.slice;

var slice = exports.slice = function(arr, start, end) {
  return __slice.call(arr, start, end);
};

var each = exports.each = function(arr, fn, ctx) {
  for (var i = 0, l = arr.length; i < l; i++) {
    fn.call(ctx, arr[i]);
  }
};

var map = exports.map = function(arr, fn) {
  var ret = [];
  each(arr, function(item) { ret.push(fn(item)); });
  return ret;
};

var objectExtend = exports.objectExtend = function(object) {
  var others = slice(arguments, 1);
  var key, other, i, l;

  for (i = 0, l = others.length; i < l; i++) {
    other = others[i];
    for (key in other) {
      object[key] = other[key];
    }
  }

  return object;
};

