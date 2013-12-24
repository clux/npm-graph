#!/usr/bin/env node
var mdeps = require('module-deps')
  , path = require('path')
  , topiary = require('topiary')
  , shapeFn = function (o) { return o.name; }
  , dir = path.join(process.cwd(), process.argv[2] || '.')
  , name, file;

if (path.extname(dir) === '.js') { // either we need the specific entry point
  file = dir;
  name = path.basename(dir).replace(/(\.js)/, "");
}
else { // or we get a directory which we try to infer the entry point of
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

var coreModules = ['assert', 'buffer', 'child_process', 'cluster',
  'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
  'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'];

var stream = mdeps(file, {
  filter: function (id) {
    return coreModules.indexOf(id) < 0;
  }
});

var allDeps = {};
stream.on('data', function (o) {
  allDeps[o.id] = o.deps;
}).on('end', function () {
  var topTree = { name: name };
  var traverse = function (depObj, loc) {
    loc.deps = {};
    Object.keys(depObj).forEach(function (key) {
      if (path.normalize(key) === key) { // ignore local dependencies
        loc.deps[key] = { name: key };
        traverse(allDeps[depObj[key]] || {}, loc.deps[key]);
      }
    });
  };
  traverse(allDeps[file], topTree);
  console.log(topiary(topTree, 'deps', shapeFn));
});
