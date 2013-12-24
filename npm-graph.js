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
else { // or we get a directory which we infer the entry point of
  var pkg = require(path.join(dir, 'package.json'));
  file = path.join(dir, pkg.main || pkg.bin);
  name = pkg.name;
}

var coreModules = ['assert', 'buffer', 'child_process', 'cluster',
  'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
  'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'];

var opts = {
  filter: function (id) {
    return coreModules.indexOf(id) < 0;
  }
};

var depList = {};
mdeps(file, opts).on('data', function (o) {
  depList[o.id] = o.deps;
}).on('end', function () {
  //console.log(depList);
  var traverse = function (depObj, loc) {
    loc.deps = {};
    Object.keys(depObj).forEach(function (key) {
      if (path.normalize(key) === key) { // ignore local dependencies
        loc.deps[key] = { name: key };
        traverse(depList[depObj[key]] || {}, loc.deps[key]);
      }
    });
  };
  var topTree = { name: name };
  traverse(depList[file], topTree);

  console.log(topiary(topTree, 'deps', shapeFn));
});
