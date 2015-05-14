module.exports = process.env.NPM_GRAPH_COV ?
  require('./lib-cov/npm-graph.js'):
  require('./lib/npm-graph.js');

module.exports.cli = process.env.NPM_GRAPH_COV ?
  require('./lib-cov/cli.js'):
  require('./lib/cli.js');
