EMME: ECMAScript Memory Model Evaluator
========================

This tools provides an SMT-based verification for JS with shared
meoriy accesses programs

`Learn more <https://github.com/FMJS/emme>`_.

Given a JavaScript-like SharedArrayBuffer bounded execution program
(see .txt files in the examples folder), emme computes all valid
executions according with the ECMA specification
(http://tc39.github.io/ecmascript_sharedmem/shmem.html). The valid
executions are provided as: 1) graphvis relational representation
between memory events (i.e., mm*.dot), and 2) possible outputs (i.e.,
outputs.txt) of the JS program (i.e., program.js).

For more details have a look at docs/documentation.pdf.

For lazy users, run:
- cd ext_tools && sudo get_CVC4.sh && cd .. (to install the CVC4 SMT solver)
- make (to install python dependencies)
- python emme.py examples/single_var/sv_simple01.txt (to generate
  the valid executions in the folder examples/single_var/sv_simple01/)
- litmus.py -c "<path to d8> --harmony_sharedarraybuffer examples/single_var/sv_simple01/program.js"
  -o examples/single_var/sv_simple01/outputs.txt -n 1k -j 4 (to check
   if the d8 engine obeys the expected results)


# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

   
