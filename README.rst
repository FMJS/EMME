EMME: ECMAScript Memory Model Evaluator
========================

This tools provides an SMT-based verification for JavaScript programs
with shared array memory access (i.e., SharedArrayBuffer).

`Learn more <https://github.com/FMJS/emme>`_.

Briefly, given a JavaScript-like SharedArrayBuffer bounded execution program (see .bex files in the examples folder), EMME computes all valid executions according with the ECMA specification (http://tc39.github.io/ecmascript_sharedmem/shmem.html). The valid executions are provided as: 1) a set of graphviz files represeting the memory model relations (i.e., mm*.dot), and 2) an assertion on the automatically generated JavaScript program (i.e., program.js).

For more details have a look at docs/documentation.pdf.

To start playing with the tool, you can run:

1) ``cd ext_tools && bash get_CVC4.sh && cd ..`` (to install the CVC4 SMT solver. See http://cvc4.cs.stanford.edu/ for licensing and additional informations)

2) ``cd ext_tools && bash get_v8.sh && cd ..`` (to install V8 JS engine. See https://developers.google.com/v8/ for licensing and additional informations)

3) ``make`` (to install python dependencies)
   
4) ``python emme.py examples/single_var/sv_simple01.bex`` (to generate the valid executions in the folder examples/single_var/sv_simple01/)
  
5) ``python litmus.py -c "bash ext_tools/run_v8.sh" -i examples/single_var/sv_simple01/program.js -n 1k -j 4`` (to check if the d8 engine obeys the expected results)

For more details on the license, have a look at LICENSE.txt
