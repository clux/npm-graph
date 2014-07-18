#!/usr/bin/env node
var graph = require('./').analyze
  , argv = require('minimist')(process.argv.slice(2))
  , path = require('path')
  , fs = require('fs')
  , dir = path.join(process.cwd(), argv._[0] || '.')
  , name, file;

var opts = {
  showLocal: Boolean(argv.l),
  showBuiltins: Boolean(argv.b),
  showCycles: Boolean(argv.c)
};

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
    throw new Error(reason);
  }
  file = path.join(dir, entry);
}

graph(file, name, function (err, str) {
  if (err) {
    throw err;
  }
  console.log(str);
}, opts);
