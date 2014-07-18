var mdeps = require('module-deps')
  , cycle = require('./cycle')
  , inspect = require('util').inspect
  , topiary = require('topiary');

// resolve non-core dependencies
var coreModules = ['assert', 'buffer', 'child_process', 'cluster',
  'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
  'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'];

var isNotBuiltin = function (id) {
  return coreModules.indexOf(id) < 0;
};
var isNotCoverage = function (id) {
  return !(/\/\w*\-cov\//).test(id);
};

var isScannedForDeps = function (id) {
  return isNotBuiltin(id) && isNotCoverage(id);
};

var notCoveredInArray = function (ary, name) {
  return ary.every(function (d) {
    return d.name !== name;
  });
};

exports.analyze = function (file, name, cb, opts) {
  opts = opts || {};

  var showInTree = function (o) {
    return (opts.showBuiltins || isNotBuiltin(o.name)) && isNotCoverage(o.name);
  };

  var lookup = {};
  mdeps(file, { filter: isScannedForDeps }).on('data', function (o) {
    // o is object with `id` and `deps` = { relReq : id }
    lookup[o.id] = Object.keys(o.deps).map(function (key) {
      return { name: key, path: o.deps[key] };
    });
  }).on('error', function (err) {
    // hopefully we can get these in the future without 'end' not happening
    console.error(err.message);
  }).on('end', function () {
    var cycleData = cycle.trimWhileCycles(lookup);
    if (opts.showCycles) {
      return console.log(inspect(cycleData.cycles, { colors: true }));
    }

    var labeler = function (o) {
      if (o.path && cycleData.removed[o.path]) {
        return o.name + " ↪ " + cycleData.removed[o.path];
      }
      return o.name;
    };

    // build a dependency tree from the flat mdeps list by recursing
    var traversal = []; // TOOD: maybe we should only keep this list for when we dive
    //but then we would need a list for each branch...
    var traverse = function (currDeps, loc, level) {
      loc.deps = loc.deps || [];
      var covered = []; // only cover unique paths once to avoid stack overflow
      currDeps.forEach(function (obj) {
        if (covered.indexOf(obj.path) < 0) {
          covered.push(obj.path); // cover unique paths only once per level
          traversal.unshift(obj.path || obj.name);

          var key = obj.name
            , isRelative = (['\\', '/', '.'].indexOf(key[0]) >= 0)
            , notCovered = notCoveredInArray(loc.deps, key)
            , isRecorded = (!isRelative || opts.showLocal) && notCovered
            , res = isRecorded ? { name: key } : loc;

          if (level > 1000) {
            var err = "About to stack-overflow - cyclical dependency likely:";
            traversal.slice(0, 50).filter(isNotBuiltin).forEach(function (l, i) {
              err += "\n\t" + i + " : " + l;
            });
            throw new Error(err);
          }

          if (isRecorded) {
            // NB: !isRecorded => only inspect the file for recorded deps
            res.path = obj.path;
            loc.deps.push(res);
          }

          // recurse (!isRecorded => keep adding to previous location)
          traverse(lookup[obj.path] || [], res, level + 1);
        }
      });
    };
    var tree = { name: name, path: file };
    traverse(lookup[file], tree, 1);

    var topResults = topiary(tree, 'deps', {
      filter: showInTree,
      sort: true,
      name: labeler
    });

    cb(null, topResults);
  });
};

exports.cycle = cycle;
