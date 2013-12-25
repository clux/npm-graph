#!/usr/bin/env node
var mdeps = require('module-deps')
  , path = require('path')
  , topiary = require('topiary')
  , shapeFn = function (o) { return o.name; }
  , dir = path.join(process.cwd(), process.argv[2] || '.')
  , name, file;

// 1. resolve entry point
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

// 2. resolve non-core dependencies
var coreModules = ['assert', 'buffer', 'child_process', 'cluster',
  'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
  'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'];

var isNotBuiltin = function (id) {
  return coreModules.indexOf(id) < 0;
};

var allDeps = {};
mdeps(file, { filter: isNotBuiltin }).on('data', function (o) {
  allDeps[o.id] = o.deps;
}).on('end', function () {
  //console.log(JSON.stringify(allDeps, null, '\t'));

  // 3. build a dependency tree from the flat mdeps list by recursing
  var topTree = { name: name };
  var traverse = function (depObj, loc) {
    loc.deps || (loc.deps = {});
    Object.keys(depObj).forEach(function (key) {
      if (path.normalize(key) !== key) {
        // keep local deps private, but keep inspecting them for modules
        traverse(allDeps[depObj[key]] || {}, loc);
      }
      else {
        // put new modules under new headers under current location
        loc.deps[key] = { name: key };
        traverse(allDeps[depObj[key]] || {}, loc.deps[key]);
      }
    });
  };
  traverse(allDeps[file], topTree);

  var filterFn = function (o) { return isNotBuiltin(o.name); };
  console.log(topiary(topTree, 'deps', shapeFn, filterFn));
});
