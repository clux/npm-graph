var mdeps = require('module-deps')
  , topiary = require('topiary')
  , labeler = function (o) { return o.name; };

// resolve non-core dependencies
var coreModules = ['assert', 'buffer', 'child_process', 'cluster',
  'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
  'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'];

var isNotBuiltin = function (id) {
  return coreModules.indexOf(id) < 0;
};
var isNotCoverage = function (id) {
  return !(/\-cov\//).test(id);
};
var isScannedForDeps = function (id) {
  return isNotBuiltin(id) && isNotCoverage(id);
};

module.exports = function (file, name, cb, opts) {
  var lookup = {};
  opts = opts || {};

  var showInTree = function (o) {
    return (opts.showBuiltins || isNotBuiltin(o.name)) && isNotCoverage(o.name);
  };

  mdeps(file, { filter: isScannedForDeps }).on('data', function (o) {
    // o is object with `id` and `deps` = { relReq : id }
    lookup[o.id] = Object.keys(o.deps).map(function (key) {
      return { name: key, path: o.deps[key] };
    });
  }).on('error', function (err) {
    // hopefully we can get these in the future without 'end' not happening
    console.warn(err.message);
  }).on('end', function () {
    // build a dependency tree from the flat mdeps list by recursing
    var covered = []; // only cover unique paths once to avoid stack overflow
    var traverse = function (currDeps, loc) {
      loc.deps = loc.deps || [];
      currDeps.sort().forEach(function (obj) {
        if (covered.indexOf(obj.path) < 0) {
          var key = obj.name
            , isRecorded = (opts.showLocal || ['\\', '/', '.'].indexOf(key[0]) < 0)
            , res = isRecorded ? { name: key } : loc;

          if (isRecorded) {
            // NB: !isRecorded => only inspect the file for recorded deps
            loc.deps.push(res);
          }
          covered.push(obj.path);
          // recurse (!isRecorded => keep adding to previous location)
          traverse(lookup[obj.path] || [], res);
        }
      });
    };
    var tree = { name: name };
    traverse(lookup[file], tree);
    cb(null, topiary(tree, 'deps', labeler, showInTree));
    //console.log(JSON.stringify(tree, null, " "));
  });

};
