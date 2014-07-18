var graph = require('../').analyze;
var join = require('path').join;

exports.packages = function (t) {
  graph(join(__dirname, 'fake-package', 'index.js'), 'fake-package', function (err, str) {
    t.ok(!err, 'worked');
    t.deepEqual(str.split('\n'), [
        "fake-package",
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
