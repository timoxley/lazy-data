'use strict'

var inherit = require('inherit')

//module.exports = function() {
  //return (function() {
    //function LazyDataBuilder() {
      //this.load = function() {
        //console.log(LazyDataBuilder.required)
      //}
    //}

    //LazyDataBuilder.requires = function(property) {
      //LazyDataBuilder.required = LazyDataBuilder.required || []
      //LazyDataBuilder.required.push(property)
      //return LazyDataBuilder
    //}

    //return LazyDataBuilder
  //})()
//}

//function createBuilder() {
  //return (function() {
    //return function LazyDataBuilder() {
      //this.load = function() {
        //console.log(LazyDataBuilder.required)
      //}
    //}
  //})()
//}

// .stuff
// .end() returns constructor

function LazyData(data) {
  console.log('LAZY DATA')
  this.data = data || {}
}

LazyData.prototype = {}

LazyData.prototype.load = LazyData.prototype.get = function load(prop, fn) {
  // property is optional
  if (typeof prop === 'function') fn = prop, prop = undefined

  fn = (typeof fn === 'function')
    ? fn
    : function(err) { if (err) { throw err } }

  // check required
  var missing = this.getMissingProperties()
  if (missing.length) error(new Error('Missing required properties: ' + missing.join(', ') + '. \r' + Object.keys(this.data)), fn)
  // if property supplied, do what is required to load that property
  var toLoad = []
  if (!prop) {
    toLoad = Object.keys(this.attrs)
  } else {
    toLoad.push(prop)
  }
  // otherwise load all properties
  var loader = this.attrs[prop]
  if (typeof loader !== 'function') {
    error(new Error('Missing property: ' + prop), fn)
    return this
  }
  loader.bind(this, fn)
  return this
}

/**
 * Get missing required properties.
 *
 * @return {Array} Missing required properties.
 * @api private
 */
LazyData.prototype.getMissingProperties = function getMissingProperties() {
  return difference(this.required, Object.keys(this.data))
}

module.exports = function() {
  return new LazyDataOptions()
}

function LazyDataOptions() {
  this.required = []
  this.attrs = {}
}

LazyDataOptions.prototype.requires = function requires(property) {
  if (typeof property !== 'string' || property.length < 1) return this
  this.required.push(property)
  return this
}

/**
 * Define a property for an object
 * @param prop
 * @param [...] {Function} some number of functions to execute in order, passing result of previous to next.
 * @api public
 */

LazyDataOptions.prototype.attr = function attr(prop, fn) {
  if (!fn) fn = function() { return undefined }
  this.attrs[prop] = fn
  return this
}

LazyDataOptions.prototype.end = function() {
  var options = this
  var Type = function(data) {
    LazyData.apply(this, arguments)
    this.__proto__.required = options.required
    this.__proto__.attrs = options.attrs
  }
  inherit(Type, LazyData)
  return Type
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
    return !~b.indexOf(prop)
  })
}

/**
 * clone properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) target[key] = source[key]
  }
  return target
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

function checkSync(fn) {
  if (fn.length) return fn
  return function(callback) {
    callback(null, fn())
  }
}

function error(err, fn) {
  if (typeof fn === 'function') return fn(err)
  throw err
}
