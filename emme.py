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

    def set_inputfile(self, inputfile):
        self.inputfile = inputfile

    def set_prefix(self, prefix):
        self.prefix = prefix
        
    def set_preproc(self, preproc):
        self.preproc = preproc

    def set_expand_bounded_sets(self, expand_bounded_sets):
        self.expand_bounded_sets = expand_bounded_sets

    def set_verbosity(self, verbosity):
        self.verbosity = verbosity

    def set_defines(self, defines):
        self.defines = defines

    def set_sat(self, sat):
        self.sat = sat

    def set_only_model(self, only_model):
        self.only_model = only_model

    def set_skip_solving(self, skip_solving):
        self.skip_solving = skip_solving
        
    def set_jsprinter(self, jsprinter):
        self.jsprinter = jsprinter
        
    def get_inputfile(self):
        return self.inputfile

    def get_prefix(self):
        return self.prefix
    
    def get_preproc(self):
        return self.preproc

    def get_expand_bounded_sets(self):
        return self.expand_bounded_sets

    def get_verbosity(self):
        return self.verbosity

    def get_defines(self):
        return self.defines

    def get_sat(self):
        return self.sat

    def get_only_model(self):
        return self.only_model

    def get_skip_solving(self):
        return self.skip_solving
    
    def get_jsprinter(self):
        return self.jsprinter
    

def main(config):
    verbosity = config.get_verbosity()
        
    parser = BeParser()
    c4printer = PrintersFactory.printer_by_name(CVC4Printer().NAME)

    abspath = os.path.abspath(__file__)
        
    model = config.get_prefix()+"memory_model.cvc"
    model_ex = config.get_prefix()+"memory_model_expanded.cvc"
    instance = config.get_prefix()+"instance.cvc"
    block_type = config.get_prefix()+"block_type.cvc"
    id_type = config.get_prefix()+"id_type.cvc"
    models = config.get_prefix()+"models.txt"
    dots = config.get_prefix()+"mm%s.dot"
    jsprogram = config.get_prefix()+"program.js"
    execs = config.get_prefix()+"outputs.txt"
    mm = ("/".join(abspath.split("/")[:-1]))+"/model/memory_model.cvc"


    if verbosity > 0:
        print("** Running with path \"%s\" **\n"%(config.get_prefix()))
        
    # Parsing of the bounded execution #
    try:
        with open(config.get_inputfile(), "r") as f:
            program = parser.program_from_string(f.read())
    except Exception as e:
        print(e)
        sys.exit(1)

    if verbosity > 0:
        sys.stdout.write("Generating bounded execution... ")
        sys.stdout.flush()
        
    if not os.path.exists(config.get_prefix()):
        os.makedirs(config.get_prefix())
        
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
    cpppre.set_defines(config.get_defines())
    strmodel = cpppre.preprocess_from_file(model)

    # Preprocessing the quantifiers #
    qupre = QuantPreprocessor()
    qupre.set_expand_sets(config.get_expand_bounded_sets())
    strmodel = qupre.preprocess_from_string(strmodel)

    # Generation of the expanded CVC4 model into the directory #
    with open(model_ex, "w") as f:
        f.write(strmodel)

    if verbosity > 0:
        sys.stdout.write("DONE\n")
        sys.stdout.flush()

    if config.get_only_model():
        sys.exit(0)



    # Running the solver to generate all sat models #
    c4solver = CVC4Solver()
    c4solver.set_verbosity(verbosity)

    if True: #not config.get_sat():
        c4solver.set_models_file(models)

    totmodels = c4solver.get_models_size()
        
    if not config.get_skip_solving():
        if verbosity > 0:
            sys.stdout.write("Solving... ")
            sys.stdout.flush()
        
        try:
            if config.get_sat():
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
    jprinter = PrintersFactory.printer_by_name(config.get_jsprinter())
    dprinter = PrintersFactory.printer_by_name("DOT")

    with open(jsprogram, "w") as f:
        f.write(jprinter.print_program(program))

    if verbosity > 0:
        sys.stdout.write("DONE\n")
        sys.stdout.flush()
    
    if (totmodels > 0) and (not config.get_sat()):
        if verbosity > 0:
            sys.stdout.write("Generating expected outputs... ")
            sys.stdout.flush()

        executions = None
        jsexecs = []
        
        try:
            with open(models, "r") as modelfile:
                executions = parser.executions_from_string(modelfile.read())
        except Exception as e:
            print(e)

        # Generation of all possible outputs for the JS litmus test #
        try:
            with open(execs, "w") as exefile:
                jsexecs = jprinter.compute_possible_executions(program, executions)
                exefile.write("\n".join(jsexecs))
        except Exception as e:
            print(e)

        # Generation of all possible MM interpretations #
        try:
            mms = dprinter.print_executions(program, executions)
            for i in range(len(mms)):
                with open(dots%(str(i+1)), "w") as dot:
                    dot.write(mms[i])
        except Exception as e:
            print(e)
            

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
    config.set_inputfile(inputfile)
    config.set_prefix(prefix)
    config.set_preproc(preproc)
    config.set_expand_bounded_sets(expand_bounded_sets)
    config.set_verbosity(verbosity)
    config.set_defines(defines)
    config.set_sat(check_sat)
    config.set_only_model(only_model)
    config.set_skip_solving(skip_solving)
    config.set_jsprinter(jsprinter)

    main(config)

