var cli = require('../').cli;
//var fs = require('fs');
var join = require('path').join;

exports.blankarg = function (t) {
  var argv = { _ : [] };

  cli(argv, function (err, str) {
    t.ok(!err, "no error");
    t.ok(str, 'got result');
    t.ok(str.indexOf('./') < 0, 'no locals');
    t.ok(str.indexOf('─path') < 0, 'no builtins');
    t.equal(str.split('\n')[0], 'npm-graph', "of cwd");
    t.done();
  });
};

exports.blankarg = function (t) {
  var argv = { _ : [], l: true, b: true };

  cli(argv, function (err, str) {
    t.ok(!err, "no error");
    t.ok(str, 'got result');
    t.equal(str.split('\n')[0], 'npm-graph', "of cwd");
    t.ok(str.indexOf('─path') >= 0, 'goto builtins');
    t.ok(str.indexOf('./cycle') >= 0, 'got locals');
    t.done();
  });
};

var writableEntry = join(
  'test',
  'fake-package',
  'node_modules',
  'readable-stream',
  'writable.js'
);
exports.cycle = function (t) {
  var argv = { _ : [writableEntry], l: true };

  cli(argv, function (err, str) {
    t.ok(!err, "no error");
    t.ok(str, 'got result');
    t.equal(str.split('\n')[0], 'writable.js', "of entrypoint");
    t.ok(str.indexOf('↪') >= 0, 'got cycle symbol');
    t.done();
  });
};

exports.cycle = function (t) {
  var argv = { _ : [writableEntry], c: true };
  cli(argv, function (err, res) {
    t.ok(!err, "no error");
    t.ok(res, 'got result');
    t.equal(res.slice(0, 5), "[ [ '", "got at least one cycle");
    t.equal(res.split('\n').length, 2, 'of size 2');
    t.done();
  });
};


