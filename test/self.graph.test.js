var test = require('tap').test
  , path = require('path')
  , graph = require('../');

test("self", function (t) {
  graph(path.join(__dirname, '..', 'npm-graph.js'), 'npm-graph', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
        "npm-graph",
        " ├──┬module-deps",
        " │  ├──┬browser-resolve",
        " │  │  └───resolve",
        " │  ├──┬concat-stream",
        " │  │  └──┬bops",
        " │  │     ├───base64-js",
        " │  │     └───to-utf8",
        " │  ├──┬detective",
        " │  │  ├──┬escodegen",
        " │  │  │  └──┬source-map",
        " │  │  │     └───amdefine",
        " │  │  └───esprima",
        " │  ├───resolve",
        " │  └───through",
        " └───topiary"
      ],
      "graph of own deps"
    );
    t.end();
  });
});
