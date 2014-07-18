# npm graph
[![npm status](http://img.shields.io/npm/v/npm-graph.svg)](https://www.npmjs.org/package/npm-graph)
[![build status](https://secure.travis-ci.org/clux/npm-graph.svg)](http://travis-ci.org/clux/npm-graph)
[![dependency status](https://david-dm.org/clux/npm-graph.svg)](https://david-dm.org/clux/npm-graph)
[![coverage status](http://img.shields.io/coveralls/clux/npm-graph.svg)](https://coveralls.io/r/clux/npm-graph)
[![unstable](http://img.shields.io/badge/stability-unstable-E5AE13.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

Essentially `npm ls` with two modifications:

- only listing dependencies that are explicitly required
- highlights cyclical dependencies

## Usage
Install globally and give it a path to a _local_ package or a file:

```bash
$ npm install -g npm-graph
```

### no arguments - npm modules only

```
$ npm-graph node_modules/irc-stream/
irc-stream
 └───irc
```

If all modules in "dependencies" are used, then this should look like `npm ls`.

### show builtins

```
$ npm-graph node_modules/irc-stream/ -b
irc-stream
 ├──┬irc
 │  ├───net
 │  ├───tls
 │  └───util
 └───stream
```

This can give some at a glance information about how browserifiable the module is.

### show local files
File by file inclusion (a requirement for cycle detection):

```
$ npm-graph node_modules/irc-stream/ -l
irc-stream
 └──┬irc
    ├───./codes
    └───./colors
```

### cycle detection
Cycles are detected and shown in the tree with a `↪` after an offender. As an example, readable-stream (tsk tsk) closes a cyclical loop by having Duplex depend on Writable and vice versa (albeit lightly).

```
$ npm install readable-stream@1.0.27-1
$ npm-graph node_modules/readable-stream/writable.js -l
writable.js
 └─┬./lib/_stream_writable.js
   ├─┬./_stream_duplex ↪ ./_stream_writable
   │ ├─┬./_stream_readable
   │ │ ├──core-util-is
   │ │ ├──inherits
   │ │ ├──isarray
   │ │ └──string_decoder/
   │ ├──core-util-is
   │ └──inherits
   ├──core-util-is
   └──inherits
```

The mutual file inclusions would normally cause a recursion overflow when generating the tree if we hadn't first found the [strongly connected components](https://npmjs.org/package/strongly-connected-components) in the inclusion digraph and manually broken the cycle. Thank you mathematics.

The cyclical components from Tarjan's algorithm are also available with `-c`:

```
$ npm-graph node_modules/readable-stream/writable.js -l -c
[ [ './node_modules/readable-stream/lib/_stream_writable.js',
    './node_modules/readable-stream/lib/_stream_duplex.js' ] ]
```

In this case, a 2-cycle.

## License
MIT-Licensed. See LICENSE file for details.
