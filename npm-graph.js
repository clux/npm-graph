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
  var lookup = {};
  opts = opts || {};

  var showInTree = function (o) {
    return opts.showBuiltins || isNotBuiltin(o.name);
  };

  mdeps(file, { filter: isNotBuiltin }).on('data', function (o) {
    // o is object with `id` and `deps` = { relReq : id }
    lookup[o.id] = Object.keys(o.deps).map(function (key) {
      return { name: key, path: o.deps[key] };
    });
  }).on('error', function (err) {
    // hopefully we can get these in the future without 'end' not happening
    console.warn(err.message);
  }).on('end', function () {
    // build a dependency tree from the flat mdeps list by recursing
    var traverse = function (currDeps, loc) {
      loc.deps = loc.deps || [];
      console.log('curr', currDeps, '&&&&&&&&&&&&&&&&')
      currDeps.sort().forEach(function (obj) {
        var key = obj.name
          , children = lookup[obj.path]
          , isRecorded = (opts.showLocal || ['\\', '/', '.'].indexOf(key[0]) < 0);

        var res = isRecorded ? { name: key } : loc;
        if (isRecorded) {
          // NB: !isRecorded => only inspect the file for recorded deps
          loc.deps.push(res);
        }
        // recurse (!isRecorded => keep adding to previous location)
        traverse(lookup[obj.path] || [], res);
      });
    };
    var tree = { name: name };
    traverse(lookup[file], tree);
    cb(null, topiary(tree, 'deps', labeler, showInTree));
    //console.log(JSON.stringify(tree, null, " "));
  });

};
