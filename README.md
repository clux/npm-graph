# npm graph
[![Build Status](https://secure.travis-ci.org/clux/npm-graph.png)](http://travis-ci.org/clux/npm-graph)
[![Dependency Status](https://david-dm.org/clux/npm-graph.png)](https://david-dm.org/clux/npm-graph)
[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

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
