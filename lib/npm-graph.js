var mdeps = require('module-deps')
  , cycle = require('./cycle')
  , inspect = require('util').inspect
  , topiary = require('topiary');

// resolve non-core dependencies
var coreModules = ['assert', 'buffer', 'child_process', 'cluster',
  'console', 'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
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
  var isActuallyScanned = function (id) {
    return isScannedForDeps(id) && (opts.ignored || []).indexOf(id) < 0;
  };

  var failed = false;
  var lookup = {};
  var md = mdeps({
    filter: isActuallyScanned,
    ignoreMissing: opts.ignoreMissing
  });
  md.on('error', function (err) {
    if (!failed) {
      failed = true;
      cb(err);
    }
  });
  md.on('data', function (o) {
    // o is object with `id` and `deps` = { relReq : id }
    lookup[o.id] = Object.keys(o.deps).map(function (key) {
      return { name: key, path: o.deps[key] };
    });
  });
  md.on('end', function () {
    if (failed) {
      return;
    }
    var cycleData = cycle.trimWhileCycles(lookup);
    if (opts.showCycles) {
      return cb(null, inspect(cycleData.cycles));
    }

    var labeler = function (o) {
      if (o.path && cycleData.removed[o.path]) {
        return o.name + " ↪ " + cycleData.removed[o.path];
      }
      return o.name;
    };

    // build a dependency tree from the flat mdeps list by recursing
    var traverse = function (currDeps, loc) {
      loc.deps = loc.deps || [];
      var covered = []; // only cover unique paths once to avoid stack overflow
      currDeps.forEach(function (obj) {
        if (covered.indexOf(obj.path) < 0) {
          covered.push(obj.path); // cover unique paths only once per level

          var key = obj.name
            , isRelative = (['\\', '/', '.'].indexOf(key[0]) >= 0)
            , notCovered = notCoveredInArray(loc.deps, key)
            , isRecorded = (!isRelative || opts.showLocal) && notCovered
            , res = isRecorded ? { name: key } : loc;

          if (isRecorded) {
            // NB: !isRecorded => only inspect the file for recorded deps
            res.path = obj.path;
            loc.deps.push(res);
          }

          // recurse (!isRecorded => keep adding to previous location)
          traverse(lookup[obj.path] || [], res);
        }
      });
    };
    var tree = { name: name, path: file };
    traverse(lookup[file], tree);

    cb(null, topiary(tree, 'deps', {
      filter: showInTree,
      sort: true,
      name: labeler
    }));
  });
  md.end(file);
};

exports.cycle = cycle;
