EMME: ECMAScript Memory Model Evaluator
========================
    
This tools provides a SAT/SMT-based verification for JavaScript programs
with shared array memory access (i.e., SharedArrayBuffer).

`Learn more <https://github.com/FMJS/emme>`_.

Briefly, given a JavaScript-like SharedArrayBuffer bounded execution program (see .bex files in the examples folder), EMME computes all valid executions according with the ECMA specification (http://tc39.github.io/ecmascript_sharedmem/shmem.html). The valid executions are provided as: 1) a set of graphviz files represeting the memory model relations (i.e., mm*.dot), and 2) an assertion on the automatically generated JavaScript program (i.e., program.js).

========================
Installation
========================
Using Docker:

1) install Docker with your package manager e.g., ``sudo apt-get install docker``

2) build the Docker image: ``cd docker/fedora_64 && docker build -f fedora-emme .``

3) run the Docker image: ``docker run -i -t fedora-emme /bin/bash``

On Linux and MacOS:

1) install python package dependencies: ``pip install -r requirements.txt``

2) install CVC4 SMT solver (see http://cvc4.cs.stanford.edu/ for licensing and additional informations): ``cd ext_tools && bash get_CVC4.sh && cd ..``

3) install V8 JS engine (see https://developers.google.com/v8/ for licensing and additional informations): ``cd ext_tools && bash get_v8.sh && cd ..`` 

========================
Usage
========================

To start playing with the tool, you can run:

1) ``python emme.py examples/single_var/sv_simple01.bex`` (to generate the valid executions in the folder examples/single_var/sv_simple01/)
  
2) ``python litmus.py -c "bash ext_tools/run_v8.sh" -i examples/single_var/sv_simple01/program.js -n 1k -j 4`` (to check if the d8 engine obeys the expected results)

3) ``python emme.py examples/single_var/sv_simple01.bex --unmatched --jsengine="bash ext_tools/run_v8.sh" -n 1k -j 4`` (to perform the behavioral coverage constraint analysis)

4) ``python emme.py examples/single_var/sv_simple01.bex --synth`` (to generate all equivalent programs in the folder examples/single_var/sv_simple01/)

For more details on the license, have a look at LICENSE.txt

========================
Publications
========================

- "EMME: a formal tool for ECMAScript Memory Model Evaluation". 

 *C. Mattarei, C. Barrett, S. Guo, B. Nelson, and B. Smith*. 
 
 TACAS 2018, 24th International Conference on Tools and Algorithms for the Construction and Analysis of Systems. Thessaloniki (Greece).

========================
Build Status
========================
.. image:: https://landscape.io/github/FMJS/EMME/master/landscape.svg?style=flat
   :target: https://landscape.io/github/FMJS/EMME/master
   :alt: Code Health

.. image:: https://travis-ci.org/FMJS/EMME.svg?branch=master
    :target: https://travis-ci.org/FMJS/EMME
