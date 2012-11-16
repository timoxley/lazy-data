/**
 * Initialize a new `LazyData`.
 *
 * @api public
 */

function LazyData(obj) {
  if (obj) return mixin(obj);
};

/**
 * clone LazyData properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function clone(source, target) {
  for (var key in source) {
    target[key] = source[key];
  }
  return obj;
}

module.exports = function(data) {
  return LazyData
}

// return a new object that is a function/constructor
// that has methods bound to it
// which are then inherited by any objects
// instantiated by the constructor

function LazyData(data) {

}

/**
 * Define a property for an object
 * @param prop
 * @param [...] {Function} some number of functions to execute in order, passing result of previous to next.
 * @api public
 */

LazyData.attr = function(prop, fn) {
  this.attrs[prop] = [fn]
}

/**
 * Specifies `prop` must be available for model
 * loading to work.
 *
 * @api public
 */

LazyData.requires = function(prop) {
  this.required = this.required || []
  this.required.push[prop]
  return this
}

/**
 * Get missing required properties.
 *
 * @return {Array} Missing required properties.
 * @api private
 */
LazyData.prototype.getMissingProperties = function getMissingProperties() {
  return difference(this.required, this.attr)
}

LazyData.prototype.load = function load(prop, fn) {
  // check required
  var missing = this.getMissingProperties()
  if (missing.length) fn(new Error('Missing required properties: ' + missing.join(', ')))
  // if property supplied, do what is required to load that property
  // otherwise load all properties
  return this
}

/**
 * Load single property
 * @api private
 */

LazyData.prototype.loadOne = function(prop) {

}

/**
 * Load all properties
 * @api private
 */

LazyData.prototype.loadAll = function() {

}

/**
 * Get items in a that are missing from b
 *
 * @param a
 * @param b
 * @return {Array}
 * @api private
 */

function difference(a, b) {
  return a.filter(function(prop) {
    return ~b.indexOf(prop)
  })
}

function checkSync(fn) {
  if (fn.length) return fn
  return function(callback) {
    callback(null, fn())
  }
}

