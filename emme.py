#!/usr/bin/env python

# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import argparse
import os
import sys

from ecmasab.beparsing import BeParser
from ecmasab.printers import JSV8Printer, CVC4Printer, PrintersFactory, PrinterType, NotRegisteredPrinterException

from ecmasab.preprocess import ExtPreprocessor, QuantPreprocessor
from ecmasab.solvers import CVC4Solver

class Config():
    inputfile = None
    preproc = None
    expand_bounded_sets = None
    verbosity = None
    defines = None
    prefix = None
    sat = None
    only_model = None
    skip_solving = None
    jsprinter = None
    
    def __init__(self):
        self.inputfile = None
        self.preproc = None
        self.expand_bounded_sets = None
        self.verbosity = None
        self.defines = None
        self.prefix = None
        self.sat = None
        self.only_model = None
        self.skip_solving = None
        self.jsprinter = None
    

def main(config):
    verbosity = config.verbosity
        
    parser = BeParser()
    c4printer = PrintersFactory.printer_by_name(CVC4Printer().NAME)

    abspath = os.path.abspath(__file__)
        
    model = config.prefix+"memory_model.cvc"
    model_ex = config.prefix+"memory_model_expanded.cvc"
    instance = config.prefix+"instance.cvc"
    block_type = config.prefix+"block_type.cvc"
    id_type = config.prefix+"id_type.cvc"
    models = config.prefix+"models.txt"
    dots = config.prefix+"mm%s.dot"
    jsprogram = config.prefix+"program.js"
    execs = config.prefix+"outputs.txt"
    mm = ("/".join(abspath.split("/")[:-1]))+"/model/memory_model.cvc"

    if verbosity > 0:
        print("** Running with path \"%s\" **\n"%(config.prefix))

    # Parsing of the bounded execution #
    with open(config.inputfile, "r") as f:
        program = parser.program_from_string(f.read())

    if verbosity > 0:
        sys.stdout.write("Generating bounded execution... ")
        sys.stdout.flush()
        
    if not os.path.exists(config.prefix):
        os.makedirs(config.prefix)
        
    if verbosity > 0:
        sys.stdout.write("DONE\n")
        sys.stdout.flush()
        
    if verbosity > 0:
        sys.stdout.write("Generating SMT model... ")
        sys.stdout.flush()

    # Copy of Memory Model (CVC4) into the directory #
    with open(mm, "r") as inmm:
        with open(model, "w") as outmm:
            outmm.write(inmm.read())

    # Generation of the CVC4 bounded execution #
    with open(instance, "w") as f:
        f.write(c4printer.print_program(program))

    # Generation of the CVC4 memory blocks #
    with open(block_type, "w") as f:
        f.write(c4printer.print_block_type(program))

    # Generation of the CVC4 memory events #
    with open(id_type, "w") as f:
        f.write(c4printer.print_data_type(program))
        
    # Preprocessing the model using cpp #
    cpppre = ExtPreprocessor("cpp")
    cpppre.set_output_file(model_ex)
    cpppre.set_defines(config.defines)
    strmodel = cpppre.preprocess_from_file(model)

    # Preprocessing the quantifiers #
    qupre = QuantPreprocessor()
    qupre.set_expand_sets(config.expand_bounded_sets)
    strmodel = qupre.preprocess_from_string(strmodel)

    # Generation of the expanded CVC4 model into the directory #
    with open(model_ex, "w") as f:
        f.write(strmodel)

    if verbosity > 0:
        sys.stdout.write("DONE\n")
        sys.stdout.flush()

    if config.only_model:
        sys.exit(0)

    # Running the solver to generate all sat models #
    c4solver = CVC4Solver()
    c4solver.set_verbosity(verbosity)

    if True: #not config.sat:
        c4solver.set_models_file(models)

    totmodels = c4solver.get_models_size()
        
    if not config.skip_solving:
        if verbosity > 0:
            sys.stdout.write("Solving... ")
            sys.stdout.flush()
        
        try:
            if config.sat:
                totmodels = c4solver.solve_n(strmodel, 1)
            else:
                totmodels = c4solver.solve_all(strmodel)
        except KeyboardInterrupt:
            pass

        if verbosity > 0:
            sys.stdout.write("DONE\n")
            sys.stdout.flush()

    if verbosity > 0:
        if totmodels > 0:
            print(" -> Found %s total models"%(totmodels))
        else:
            print(" -> No viable executions found")

    if verbosity > 0:
        sys.stdout.write("Generating JS program... ")
        sys.stdout.flush()
        
    # Generation of the JS litmus test #
    jprinter = PrintersFactory.printer_by_name(config.jsprinter)
    dprinter = PrintersFactory.printer_by_name("DOT")

    with open(jsprogram, "w") as f:
        f.write(jprinter.print_program(program))

    if verbosity > 0:
        sys.stdout.write("DONE\n")
        sys.stdout.flush()
    
    if (totmodels > 0) and (not config.sat):
        if verbosity > 0:
            sys.stdout.write("Generating expected outputs... ")
            sys.stdout.flush()

        executions = None
        jsexecs = []
        
        with open(models, "r") as modelfile:
            executions = parser.executions_from_string(modelfile.read())

        with open(execs, "w") as exefile:
            jsexecs = jprinter.compute_possible_executions(program, executions)
            exefile.write("\n".join(jsexecs))
            
        # Generation of all possible outputs for the JS litmus test #
        with open(execs, "w") as exefile:
            jsexecs = jprinter.compute_possible_executions(program, executions)
            exefile.write("\n".join(jsexecs))

        # Generation of all possible MM interpretations #
        mms = dprinter.print_executions(program, executions)
        for i in range(len(mms)):
            with open(dots%(str(i+1)), "w") as dot:
                dot.write(mms[i])

        if verbosity > 0:
            sys.stdout.write("DONE\n")
            sys.stdout.flush()

        if verbosity > 0:
            print(" -> Found %s total possible outputs"%(len(jsexecs)))
            
    if (verbosity > 0):
        print("\nExiting...")
        
        
if __name__ == "__main__":

    CPP = "cpp"
    preproc = None
    cpp_preproc = True
    expand_bounded_sets = True
    verbosity = 0
    defines = ""
        
    parser = argparse.ArgumentParser(description='EMME: ECMAScript Memory Model Evaluatior')

    
    parser.add_argument('input_file', metavar='program', type=str, 
                       help='the input file describing the program')
    

    jsprinters = [x.get_name() for x in PrintersFactory.get_printers_by_type(PrinterType.JS)]
    djsprinter = JSV8Printer().NAME

    parser.set_defaults(jsprinter=djsprinter)
    parser.add_argument('-j', '--jsprinter', metavar='jsprinter', type=str, nargs='?',
                        help='select the JS printer between \"%s\", default is \"%s\"'%("|".join(jsprinters), djsprinter))

    parser.set_defaults(verbosity=1)
    parser.add_argument('-v', dest='verbosity', metavar="verbosity", type=int,
                        help="verbosity level, default is 1")

    parser.set_defaults(check_sat=False)
    parser.add_argument('-s', dest='check_sat', action='store_true',
                        help="performs only the satisfiability checking")


    parser.set_defaults(only_model=False)
    parser.add_argument('-m', '--only-model', dest='only_model', action='store_true',
                        help="exists right after the model generation")


    parser.set_defaults(skip_solving=False)
    parser.add_argument('-k', '--skip-solving', dest='skip_solving', action='store_true',
                        help="skips the solving part")

    
    parser.set_defaults(expand_bounded_sets=True)
    parser.add_argument('-n','--no-exbounded', dest='expand_bounded_sets', action='store_false',
                        help="disables the bounded sets quantifier expansion")

    
    parser.set_defaults(prefix=None)
    parser.add_argument('-p', '--prefix', metavar='prefix', type=str, nargs='?',
                        help='directory where to store the results. If none, it will be the same as the input file')

    
    parser.set_defaults(preproc=None)
    parser.add_argument('--preproc', metavar='preproc', type=str, nargs='?',
                        help='the memory model preprocessor, default is \"%s\"'%CPP)

    parser.set_defaults(defines=None)
    parser.add_argument('--defines', metavar='defines', type=str, nargs='?',
                       help='the set of preprocessor\'s defines')
    
    parser.set_defaults(cpp_preproc=True)
    parser.add_argument('--no-cpp', dest='cpp_preproc', action='store_false',
                        help="disables the call of the cpp preprocessor")
    

    args = parser.parse_args()

    inputfile = args.input_file
    prefix = args.prefix
    cpp_preproc = args.cpp_preproc
    only_model = args.only_model
    preproc = args.preproc
    verbosity = args.verbosity
    expand_bounded_sets = args.expand_bounded_sets
    defines = args.defines
    check_sat = args.check_sat
    skip_solving = args.skip_solving
    jsprinter = args.jsprinter
    
    if cpp_preproc and (not preproc):
        preproc = CPP

    if not prefix:
        prefix = inputfile.split("/")
        prefix[-1] = prefix[-1].split(".")[0]
        prefix = "/".join(prefix)
        prefix += "/"
        

    if not os.path.exists(inputfile):
        print("File not found: \"%s\""%inputfile)
        sys.exit(1)
    
    config = Config()
    config.inputfile = inputfile
    config.prefix = prefix
    config.preproc = preproc
    config.expand_bounded_sets = expand_bounded_sets
    config.verbosity = verbosity
    config.defines = defines
    config.sat = check_sat
    config.only_model = only_model
    config.skip_solving = skip_solving
    config.jsprinter = jsprinter

    try:
        main(config)
    except Exception as e:
        print(e)
        sys.exit(1)

