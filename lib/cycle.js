var ssc = require('strongly-connected-components');

var createAdjacencyArrays = function (ms) {
  var indexed = []; // index -> unique id map
  Object.keys(ms).forEach(function (key, i) {
    indexed[i] = key; // what's the unique id of index i
  });
  var adjacency = []; // index -> [adjacent indexes]
  Object.keys(ms).forEach(function (key, i) {
    adjacency[i] = ms[key].filter(function (o) {
      return o.path; // only care about cyclicals in code we can scan (not builtins)
    }).map(function (o) {
      // now leave only a map o
      var idx = indexed.indexOf(o.path);
      if (idx < 0) {
        throw new Error("logic fail");
      }
      return idx;
    });
  });

  return { indexes: indexed, adjacency: adjacency };
};

exports.detect = function (ms) {
  var arys = createAdjacencyArrays(ms);
  var comps = ssc(arys.adjacency).components;
  arys.cycles = comps.filter(function (c) {
    return c.length > 1; // length 1 components have nothing referring back to it :]
  }).map(function (c) {
    return c.map(function (i) {
      return arys.indexes[i]; // convert back to unique ids
    });
  });
  return arys;
};

var trimList = function (ms) {
  var output = exports.detect(ms);
  if (output.cycles.length) {
    output.cycles.forEach(function (cycle) {
      var last = cycle[cycle.length-1]; // last id in cycle
      //console.log('will try to trim from', last, ms[last]);

      // need to find a dependency in the cycle
      var depsInCycle = ms[last].filter(function (deps) {
        return deps.path && cycle.indexOf(deps.path) >= 0;
      });
      if (!depsInCycle.length) {
        throw new Error("logic fail2"); // last thing in a cycle should have deps
      }
      var depToRemove = depsInCycle[0].path;
      //console.log('deps in cycle', depsInCycle);

      for (var i = 0; i < ms[last].length; i += 1) {
        var dep = ms[last][i];
        if (dep.path && dep.path === depToRemove) {
          //console.log('removing', depToRemove);
          ms[last].splice(i, 1);
        }
      }
      //console.log('after remove', ms[last]);
    });

    exports.detect(ms); // recompute cycles
  }
  return output.cycles;
};

// modifies input array
exports.trimWhileCycles = function (ms) {
  var cycles = trimList(ms);
  while (cycles.length) {
    cycles = trimList(ms);
  }
};
