module.exports = process.env.NPM_GRAPH_COV
  ? require('./lib-cov/npm-graph.js')
  : require('./lib/npm-graph.js');
