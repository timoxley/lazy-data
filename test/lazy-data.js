'use strict'

var LazyData = require('lazy-data')
var assert = require('timoxley-assert')

describe('.requires()', function() {
  describe('with required property', function() {
    var Item;
    beforeEach(function() {
      Item = LazyData()
        .requires('id')
        .end()
    })
    it('errors if missing required properties', function(done) {
      var item = new Item()
      item.load(function(err) {
        assert.ok(err)
        assert.ok(/required/, err.message)
        done()
      })
    })
    it('does not error if not missing required properties', function(done) {
      var item = new Item({
        id: 1
      })
      item.load(done)
    })
  })
  describe('prototype configuration', function() {
    it('does not share data across different Types', function() {
      var DefinesId = LazyData().attr('id').end()
      var RequiresId = LazyData().requires('id').end()
      var noId = new DefinesId()
      noId.load()
      assert.throws(function() {
        var noId2 = new RequiresId()
        noId2.load()
      })
    })
  })
  describe('with invalid required properties', function() {
    it('does not error', function() {
      [ LazyData().requires(),
        LazyData().requires(null),
        LazyData().requires(undefined),
        LazyData().requires(0),
        LazyData().requires('')
      ].forEach(function(config) {
        var Type = config.end()
        var t = new Type()
        t.load()
      })
    })
  })
})
describe('attributes', function() {
  describe('simple attributes', function() {
    var Item
    beforeEach(function() {
      Item = LazyData()
        .attr('id')
        .end()
    })
    it('sets attribute to undefined', function() {
      var item = new Item()
      item.load('id', function() {
        debugger
      })
    })
  })
})
