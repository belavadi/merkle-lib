var crypto = require('crypto')
var merkle = require('../')
var fastRoot = require('../fastRoot')
var tape = require('tape')
var fixtures = require('./fixtures')

tape('throws on bad types', function (t) {
  t.throws(function () { merkle('not an array') })
  t.throws(function () { merkle([], 'not a function') })
  t.throws(function () { fastRoot('not an array') })
  t.throws(function () { fastRoot([], 'not a function') })
  t.end()
})

tape('generation, for each fixture', function (t) {
  fixtures.forEach(function (f) {
    function digest (x) {
      return crypto.createHash(f.hash).update(x).digest()
    }

    var values = f.values.map(function (x) { return new Buffer(x, 'hex') })
    var tree = merkle(values, digest).map(function (x) { return x.toString('hex') })
    var root = fastRoot(values, digest).toString('hex')

    t.same(f.tree, tree, 'matches the tree')
    t.equal(f.tree[f.tree.length - 1], root, 'fastRoot returns the tree root')
  })

  t.end()
})
