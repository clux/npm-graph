var graph = require('./npm-graph').analyze
  , path = require('path')
  , fs = require('fs')
  ;

module.exports = function (argv, cb) {
  var dir = path.join(process.cwd(), argv._[0] || '.');
  var opts = {
    showLocal: Boolean(argv.l),
    showBuiltins: Boolean(argv.b),
    showCycles: Boolean(argv.c),
    ignoreMissing: Boolean(argv.s)
  };

  var name, file;
  // resolve entry point dynamically
  if (path.extname(dir) === '.js') { // either we got the specific entry point
    file = dir;
    name = path.basename(dir);
  }
  else { // or we got a directory which we try to infer the entry point of
    var pkg = require(path.join(dir, 'package.json'));
    name = pkg.name;
    var entry = pkg.main || 'index.js';

    if (!fs.existsSync(path.join(dir, entry))) {
      var reason = "Failed to find the entry point of " + name;
      reason += " - try specifying it directly";
      return cb(new Error(reason));
    }
    file = path.join(dir, entry);
  }

  graph(file, name, cb, opts);
};
