var graph = require('../').analyze;
var join = require('path').join;

exports.packages = function (t) {
  graph(join(__dirname, 'fake-package', 'index.js'), 'fp', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
        "fp",
        " └──fake2"
      ],
      "fake-package deps"
    );
    t.done();
  });
};

exports.showLocal = function (t) {
  graph(join(__dirname, 'fake-package', 'index.js'), 'fake', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
        "fake",
        " ├─┬./loc1",
        " │ └─┬./loc3",
        " │   └──fake2",
        " ├─┬./loc2",
        " │ ├─┬./loc1",
        " │ │ └─┬./loc3",
        " │ │   └──fake2",
        " │ └──fake2",
        " └─┬./loc3",
        "   └──fake2"
      ],
      "local dependencies of fake-package"
    );
    t.done();
  }, { showLocal: true });
};

exports.entryPoint = function (t) {
  graph(join(__dirname, 'fake-package', 'loc2.js'), 'loc2.js', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
        "loc2.js",
        " ├─┬./loc1",
        " │ └─┬./loc3",
        " │   └──fake2",
        " └──fake2"
      ],
      "local dependencies of fake-package"
    );
    t.done();
  }, { showLocal: true });
};

exports.cycleModule = function (t) {
  var writableEntry = join(
    __dirname,
    'fake-package',
    'node_modules',
    'readable-stream',
    'writable.js'
  );
  graph(writableEntry, 'writable.js', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
      "writable.js",
      " └─┬./lib/_stream_writable.js",
      "   ├─┬./_stream_duplex ↪ ./_stream_writable",
      "   │ ├─┬./_stream_readable",
      "   │ │ ├──core-util-is",
      "   │ │ ├──inherits",
      "   │ │ ├──isarray",
      "   │ │ └──string_decoder/",
      "   │ ├──core-util-is",
      "   │ └──inherits",
      "   ├──core-util-is",
      "   └──inherits"
    ], "cycle indicated");
    t.done();
  }, { showLocal: true });
};

exports.cycleModuleCycles = function (t) {
  var writableEntry = join(
    __dirname,
    'fake-package',
    'node_modules',
    'readable-stream',
    'writable.js'
  );
  graph(writableEntry, 'writable.js', function (err, str) {
    t.ok(!err, 'worked');
    var out = str.split('\n').map(function (s) {
      // remove start of that absolute path string
      return s.match(/\/readable\-stream\/(.*)/)[1];
    });
    t.deepEqual(out, [
      "lib/_stream_writable.js',",
      "lib/_stream_duplex.js' ] ]"
    ], "cycle indicated");
    t.done();
  }, { showLocal: true, showCycles: true });
};

exports.jsonIncludes = function (t) {
  // TODO: this SHOULD work without ignoreMissing
  // but currently the default module-deps resolver (browser-resolve)
  // does not handle json includes without the extension in the require
  // the same goes for the resolve package which is the nodey thing
  graph(join(__dirname, 'json-includes', 'index.js'), 'ji', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), ["ji"], "json-includes deps");
    t.done();
  }, { ignoreMissing: true });
};
