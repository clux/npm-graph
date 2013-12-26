var mdeps = require('module-deps')
  , topiary = require('topiary')
  , shapeFn = function (o) { return o.name; };

// resolve non-core dependencies
var coreModules = ['assert', 'buffer', 'child_process', 'cluster',
  'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
  'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'];

var isNotBuiltin = function (id) {
  return coreModules.indexOf(id) < 0;
};

module.exports = function (file, name, cb, opts) {
  var allDeps = {};
  opts = opts || {};
  try {
    mdeps(file, { filter: isNotBuiltin }).on('data', function (o) {
      allDeps[o.id] = o.deps;
    }).on('end', function () {
      //console.log(JSON.stringify(allDeps, null, '\t'));

      // build a dependency tree from the flat mdeps list by recursing
      var topTree = { name: name };
      var traverse = function (depObj, loc) {
        loc.deps = loc.deps || {};
        Object.keys(depObj).sort().forEach(function (key) {
          if (!opts.showLocal && ['\\', '/', '.'].indexOf(key[0]) >= 0) {
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

      var filterFn = function (o) {
        return opts.showBuiltins || isNotBuiltin(o.name);
      };
      cb(null, topiary(topTree, 'deps', shapeFn, filterFn));
    });
  }
  catch (e) {
    cb(e);
  }
};
