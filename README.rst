EMME: ECMAScript Memory Model Evaluator
========================

This tools provides an SMT-based verification for JavaScript programs
with shared array memory access (i.e., SharedArrayBuffer).

`Learn more <https://github.com/FMJS/emme>`_.

Breafly, given a JavaScript-like SharedArrayBuffer bounded execution
program (see .txt files in the examples folder), EMME computes all
valid executions according with the ECMA specification
(http://tc39.github.io/ecmascript_sharedmem/shmem.html). The valid
executions are provided as: 1) graphvis relational representation
between memory events (i.e., mm*.dot), and 2) possible outputs (i.e.,
outputs.txt) of the JS program (i.e., program.js).

For more details have a look at docs/documentation.pdf.

For lazy users, run:

1) cd ext_tools && sudo get_CVC4.sh && cd .. (to install the CVC4 SMT solver)
   
2) make (to install python dependencies)
   
3) python emme.py examples/single_var/sv_simple01.txt (to generate the valid executions in the folder examples/single_var/sv_simple01/)
  
4) litmus.py -c "<path to d8> --harmony_sharedarraybuffer examples/single_var/sv_simple01/program.js" -o examples/single_var/sv_simple01/outputs.txt -n 1k -j 4 (to check if the d8 engine obeys the expected results)

For more details on the license, have a look at LICENSE.txt
