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

module.exports = function (file, name, cb, opts) {
  var allDeps = {};
  opts = opts || {};

  var showInTree = function (o) {
    return opts.showBuiltins || isNotBuiltin(o.name);
  };

  mdeps(file, { filter: isNotBuiltin }).on('data', function (o) {
    allDeps[o.id] = o.deps;
  }).on('error', function (err) {
    // hopefully we can get these in the future without 'end' not happening
    console.warn(err.message);
  }).on('end', function () {
    //console.log(JSON.stringify(allDeps, null, '\t'));

    // build a dependency tree from the flat mdeps list by recursing
    var traverse = function (currDeps, loc) {
      loc.deps = loc.deps || {};
      Object.keys(currDeps).sort().forEach(function (key) {
        var isRecorded = (opts.showLocal || ['\\', '/', '.'].indexOf(key[0]) < 0);
        if (isRecorded) {
          // NB: !isRecorded => only inspect the file for recorded deps
          loc.deps[key] = { name: key };
        }
        // recurse (!isRecorded => keep adding to previous location)
        traverse(allDeps[currDeps[key]] || {}, isRecorded ? loc.deps[key] : loc);
      });
    };
    var tree = { name: name };
    traverse(allDeps[file], tree);

    cb(null, topiary(tree, 'deps', labeler, showInTree));
  });

};
