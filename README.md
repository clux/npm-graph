# npm graph
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
