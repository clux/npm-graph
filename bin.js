#!/usr/bin/env node
var graph = require('./npm-graph')
  , path = require('path')
  , dir = path.join(process.cwd(), process.argv[2] || '.')
  , name, file;

// resolve entry point dynamically
if (path.extname(dir) === '.js') { // either we got the specific entry point
  file = dir;
  name = path.basename(dir).replace(/(\.js)/, "");
}
else { // or we got a directory which we try to infer the entry point of
  var pkg = require(path.join(dir, 'package.json'));
  name = pkg.name;
  var entry = pkg.main || pkg.bin;
  if (Object(entry) === entry && Object.keys(entry).length) {
    entry = entry[Object.keys(entry)[0]]; // assume first key is sensible
  }

  if (entry + '' !== entry) { // verify what we got is a string
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
});
