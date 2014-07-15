# npm graph
[![npm status](http://img.shields.io/npm/v/npm-graph.svg)](https://www.npmjs.org/package/npm-graph)
[![build status](https://secure.travis-ci.org/clux/npm-graph.svg)](http://travis-ci.org/clux/npm-graph)
[![dependency status](https://david-dm.org/clux/npm-graph.svg)](https://david-dm.org/clux/npm-graph)
[![coverage status](http://img.shields.io/coveralls/clux/npm-graph.svg)](https://coveralls.io/r/clux/npm-graph)
[![unstable](http://img.shields.io/badge/stability-unstable-E5AE13.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)


`npm ls`, but without dependencies that are not explicitly required

## Usage
Install globally and give it a path to a _local_ package or a file:

```bash
$ npm install -g npm-graph

# no arguments - npm modules only
$ npm-graph irc-stream/
irc-stream
 └───irc

# show builtins
$ npm-graph irc-stream/ -b
irc-stream
 ├──┬irc
 │  ├───net
 │  ├───tls
 │  └───util
 └───stream

# show local files
$ npm-graph irc-stream/ -l
irc-stream
 └──┬irc
    ├───./codes
    └───./colors
```

## License
MIT-Licensed. See LICENSE file for details.
