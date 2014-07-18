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

exports.trimList = function (ms) {
  var output = exports.detect(ms);
  if (output.cycles.length) {
    console.log('found one cycle - cutting a tie ranomly');
  }
};
