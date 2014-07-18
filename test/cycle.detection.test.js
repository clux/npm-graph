var cycle = require('../').cycle;

var modules = {
  'md/__nm__/through2/__nm__/xtend/has-keys.js': [],
  'md/__nm__/readable-stream/__nm__/core-util-is/lib/util.js': [],
  'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/foreach.js': [],
  'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/isArguments.js': [],
  'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/shim.js': [
    { name: './foreach', path: 'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/foreach.js' },
    { name: './isArguments', path: 'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/isArguments.js' }
  ],
  'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/index.js': [
    { name: './shim', path: 'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/shim.js' }
  ],
  'md/__nm__/through2/__nm__/xtend/index.js': [
    { name: './has-keys', path: 'md/__nm__/through2/__nm__/xtend/has-keys.js' },
    { name: 'object-keys', path: 'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/index.js' }
  ],
  'md/__nm__/inherits/inherits_browser.js': [],
  'md/__nm__/readable-stream/lib/_stream_writable.js': [
    { name: 'buffer', path: false },
    { name: 'stream', path: false },
    { name: './_stream_duplex', path: 'md/__nm__/readable-stream/lib/_stream_duplex.js' },
    { name: 'core-util-is', path: 'md/__nm__/readable-stream/__nm__/core-util-is/lib/util.js' },
    { name: 'inherits',  path: 'md/__nm__/inherits/inherits_browser.js' }
  ],
  'md/__nm__/readable-stream/__nm__/string_decoder/index.js': [ { name: 'buffer', path: false } ],
  'md/__nm__/readable-stream/__nm__/isarray/index.js': [],
  'md/__nm__/readable-stream/lib/_stream_readable.js': [
    { name: 'buffer', path: false },
    { name: 'events', path: false },
    { name: 'stream', path: false },
    { name: 'core-util-is', path: 'md/__nm__/readable-stream/__nm__/core-util-is/lib/util.js' },
    { name: 'string_decoder/', path: 'md/__nm__/readable-stream/__nm__/string_decoder/index.js' },
    { name: 'inherits', path: 'md/__nm__/inherits/inherits_browser.js' },
    { name: 'isarray', path: 'md/__nm__/readable-stream/__nm__/isarray/index.js' }
  ],
  'md/__nm__/readable-stream/lib/_stream_duplex.js': [
    { name: 'core-util-is', path: 'md/__nm__/readable-stream/__nm__/core-util-is/lib/util.js' },
    { name: 'inherits', path: 'md/__nm__/inherits/inherits_browser.js' },
    { name: './_stream_writable', path: 'md/__nm__/readable-stream/lib/_stream_writable.js' },
    { name: './_stream_readable', path: 'md/__nm__/readable-stream/lib/_stream_readable.js' }
  ],
  'md/__nm__/readable-stream/lib/_stream_transform.js': [
    { name: 'core-util-is', path: 'md/__nm__/readable-stream/__nm__/core-util-is/lib/util.js' },
    { name: 'inherits', path: 'md/__nm__/inherits/inherits_browser.js' },
    { name: './_stream_duplex', path: 'md/__nm__/readable-stream/lib/_stream_duplex.js' }
  ],
  'md/__nm__/readable-stream/transform.js': [
    { name: './lib/_stream_transform.js', path: 'md/__nm__/readable-stream/lib/_stream_transform.js' }
  ],
  'md/__nm__/through2/through2.js': [
    { name: 'util', path: false },
    { name: 'xtend', path: 'md/__nm__/through2/__nm__/xtend/index.js' },
    { name: 'readable-stream/transform', path: 'md/__nm__/readable-stream/transform.js' }
  ]
};

var expected = {
  indexes: [
    'md/__nm__/through2/__nm__/xtend/has-keys.js', // 0
    'md/__nm__/readable-stream/__nm__/core-util-is/lib/util.js', // 1
    'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/foreach.js', // 2
    'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/isArguments.js', // 3
    'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/shim.js', // 4
    'md/__nm__/through2/__nm__/xtend/__nm__/object-keys/index.js', // 5
    'md/__nm__/through2/__nm__/xtend/index.js', // 6
    'md/__nm__/inherits/inherits_browser.js', // 7
    'md/__nm__/readable-stream/lib/_stream_writable.js', // 8
    'md/__nm__/readable-stream/__nm__/string_decoder/index.js', // 9
    'md/__nm__/readable-stream/__nm__/isarray/index.js', // 10
    'md/__nm__/readable-stream/lib/_stream_readable.js', // 11
    'md/__nm__/readable-stream/lib/_stream_duplex.js', // 12
    'md/__nm__/readable-stream/lib/_stream_transform.js', // 13
    'md/__nm__/readable-stream/transform.js', // 14
    'md/__nm__/through2/through2.js' // 15
  ],
  adjacency: [
    [], // 0 has-keys
    [], // 1 core utils lib util
    [], // 2 foreach
    [], // 3 isarguments
    [ 2, 3 ], // 4 object keys shim
    [ 4 ], // 5 object keys index
    [ 0, 5 ], // 6 xtend index
    [], // 7 inherits browser
    [ 12, 1, 7 ], // 8 _stream_writable
    [], // 9 string decoder index
    [], // 10 isarray index
    [ 1, 9, 7, 10 ], // 11 _stream_readable
    [ 1, 7, 8, 11 ], // 12 _stream_duplex
    [ 1, 7, 12 ], // 13 _stream_transform
    [ 13 ], // 14 transform
    [ 6, 14 ] // 15 through2
  ],
  cycles: [
    [
      'md/__nm__/readable-stream/lib/_stream_duplex.js',
      'md/__nm__/readable-stream/lib/_stream_writable.js'
    ]
  ]
};

exports.cycle = function (t) {
  var output = cycle.detect(modules);
  t.deepEqual(output.indexes, expected.indexes, "it indexed correctly");
  t.deepEqual(output.adjacency, expected.adjacency, "it created adjacency list");
  t.deepEqual(output.cycles, expected.cycles, "it found one cycle");
  t.done();
};
