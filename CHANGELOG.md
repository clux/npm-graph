0.5.0 / 2014-05-15
==================
  * Change CLI library to yargs and unit test the cli bits better
  * Remove colored output from cycle output (-c)
  * module-deps upgraded to `3.7.12` (big change)
  * Can now ignore missing dependencies with `--skip` #6
    - note that `-cov` requires are (still) ignored regardless
    - without `--skip`, first missing entry will halt the process
  * Can now ignore traversing the tree of specific modules with `--ignore` #8
    - will avoid populating huge dependency trees from specific modules
    - currently slightly inconsistent #9

0.4.0 / 2014-07-18
==================
  * do cycle analysis on the digraph given by module-deps
  * cyclical dependencies now detected and highlighted in the output tree
  * `-c` flag for raw cycles from Tarjan's algorithm
  * bump dependencies

0.3.3 / 2014-02-09
==================
  * module-deps upgraded to `1.5.0`

0.3.2 / 2014-02-09
==================
  * module-deps upgraded to `1.4.2`

0.3.1 / 2013-12-26
==================
  * `argv.b` can be used to additionally show builtins
  * `argv.l` can be used to additionally show locally required files (always parsed anyway)
  * library usage can set new options with `showBuiltins` and `showLocal` as keys

0.3.0 / 2013-12-25
==================
  * output now deterministic (#5)
  * module can now be used as a library as well

0.2.0 / 2013-12-25
==================
  * filter out builtins from the tree
  * fixed missing module dependencies from locally required files (#1)

0.1.0 / 2013-12-24
==================
  * package.json `bin` property now used properly as a fallback to directory entry

0.0.1 / 2013-12-24
==================
  * first release
