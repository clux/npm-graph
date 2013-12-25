# npm graph
[![Build Status](https://secure.travis-ci.org/clux/npm-graph.png)](http://travis-ci.org/clux/npm-graph)
[![Dependency Status](https://david-dm.org/clux/npm-graph.png)](https://david-dm.org/clux/npm-graph)
[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://nodejs.org/api/documentation.html#documentation_stability_index)

`npm ls`, but without dependencies that are not explicitly required

## Usage
Install globally and give it a path to a _local_ package or a file:

```bash
$ npm install -g npm-graph
$ npm-graph groupstage-tb/
```

Output:

```bash
groupstage-tb
 ├──┬groupstage
 │  ├──┬tournament
 │  │  ├───events
 │  │  └──┬interlude
 │  │     ├───autonomy
 │  │     ├───operators
 │  │     └───subset
 │  ├───group
 │  ├──┬interlude
 │  │  ├───autonomy
 │  │  ├───operators
 │  │  └───subset
 │  └───roundrobin
 ├──┬tiebreaker
 │  ├──┬interlude
 │  │  ├───autonomy
 │  │  ├───operators
 │  │  └───subset
 │  ├──┬tournament
 │  │  ├───events
 │  │  └──┬interlude
 │  │     ├───autonomy
 │  │     ├───operators
 │  │     └───subset
 │  └──┬groupstage
 │     ├──┬interlude
 │     │  ├───autonomy
 │     │  ├───operators
 │     │  └───subset
 │     ├──┬tournament
 │     │  ├───events
 │     │  └──┬interlude
 │     │     ├───autonomy
 │     │     ├───operators
 │     │     └───subset
 │     ├───roundrobin
 │     └───group
 └──┬tourney
    └───autonomy
```

## License
MIT-Licensed. See LICENSE file for details.
