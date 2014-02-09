var test = require('tap').test
  , join = require('path').join
  , graph = require('../');

test("self main", function (t) {
  graph(join(__dirname, '..', 'npm-graph.js'), 'npm-graph', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
        "npm-graph",
        " ├──┬module-deps",
        " │  ├──┬browser-resolve",
        " │  │  └───resolve",
        " │  ├──┬concat-stream",
        " │  │  ├───inherits",
        " │  │  ├──┬readable-stream",
        " │  │  │  ├───core-util-is",
        " │  │  │  ├───debuglog",
        " │  │  │  └───string_decoder/",
        " │  │  └───typedarray",
        " │  ├───mine",
        " │  ├───parents",
        " │  ├───resolve",
        " │  └───through",
        " └───topiary"
        //"npm-graph",
        //" ├──┬module-deps",
        //" │  ├──┬browser-resolve",
        //" │  │  └───resolve",
        //" │  ├──┬concat-stream",
        //" │  │  └──┬bops",
        //" │  │     ├───base64-js",
        //" │  │     └───to-utf8",
        //" │  ├──┬detective",
        //" │  │  ├──┬escodegen",
        //" │  │  │  └──┬source-map",
        //" │  │  │     └───amdefine",
        //" │  │  └───esprima",
        //" │  ├───resolve",
        //" │  └───through",
        //" └───topiary"
      ],
      "graph of own deps"
    );
    t.end();
  });
});

test("self bin", function (t) {
  graph(join(__dirname, '..', 'bin.js'), 'bin.js', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
        "bin.js",
        " ├──┬module-deps",
        " │  ├──┬browser-resolve",
        " │  │  └───resolve",
        " │  ├──┬concat-stream",
        " │  │  ├───inherits",
        " │  │  ├──┬readable-stream",
        " │  │  │  ├───core-util-is",
        " │  │  │  ├───debuglog",
        " │  │  │  └───string_decoder/",
        " │  │  └───typedarray",
        " │  ├───mine",
        " │  ├───parents",
        " │  ├───resolve",
        " │  └───through",
        " ├───topiary",
        " └───minimist"
      ],
      "graph of own cli deps"
    );
    t.end();
  });
});
