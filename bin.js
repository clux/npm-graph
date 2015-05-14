#!/usr/bin/env node
var argv = require('yargs')
  .usage('Usage: npm-graph <entryPoint> [options]')
  .example('npm-graph')
  .example('npm-graph node_modules/yargs')
  .example('npm-graph cli.js')
  .alias('l', 'locals')
  .describe('l', 'Show local file requires')
  .boolean('l')
  .alias('b', 'builtins')
  .describe('b', 'Show built in modules')
  .boolean('b')
  .alias('c', 'cycles')
  .describe('c', 'Show cycles')
  .help('h', 'help')
  .help('h')
  .argv;

require('./').cli(argv, function (err, result) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log(result);
  process.exit(0);
});
