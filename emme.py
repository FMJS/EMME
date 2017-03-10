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
from six.moves import range
import subprocess

from ecmasab.beparsing import BeParser
from ecmasab.printers import JSV8Printer, CVC4Printer, DotPrinter, PrintersFactory, PrinterType
from ecmasab.execution import RF, HB, SW
from ecmasab.exceptions import UnreachableCodeException

from ecmasab.preprocess import ExtPreprocessor, QuantPreprocessor, CPP
from ecmasab.solvers import CVC4Solver


FORMAL_MODEL = "./model/memory_model.cvc"

MEMORY_MODEL = "memory_model.cvc"
MEMORY_MODEL_EX = "memory_model_expanded.cvc"
INSTANCE = "instance.cvc"
BLOCK_TYPE = "block_type.cvc"
ID_TYPE = "id_type.cvc"
MODELS = "models.txt"
DOTS = "mm%s.dot"
GRAP = "gmm%s.png"
JSPROGRAM = "program.js"
EXECS = "outputs.txt"

ALL = "all"

E_CONDITIONS = ",ENCODE_CONDITIONS=1"

DEBUG = False

class Config(object):
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
    printing_relations = None
    graphviz = None
    jsdir = None
    debug = None
    
    model = None
    model_ex = None
    instance = None
    block_type = None
    id_type = None
    models = None
    dots = None
    grap = None
    jsprogram = None
    execs = None
    mm = None
    
    def __init__(self):
        self.inputfile = None
        self.preproc = CPP
        self.expand_bounded_sets = True
        self.verbosity = 0
        self.defines = None
        self.prefix = None
        self.sat = False
        self.only_model = False
        self.skip_solving = False
        self.jsprinter = None
        self.graphviz = None
        self.printing_relations = ",".join([RF,HB,SW])
        self.jsdir = None
        self.debug = False
        
    def generate_filenames(self):
        if self.prefix:
            self.model = self.prefix+MEMORY_MODEL
            self.model_ex = self.prefix+MEMORY_MODEL_EX
            self.instance = self.prefix+INSTANCE
            self.block_type = self.prefix+BLOCK_TYPE
            self.id_type = self.prefix+ID_TYPE
            self.models = self.prefix+MODELS
            self.dots = self.prefix+DOTS
            self.grap = self.prefix+GRAP
            self.jsprogram = self.prefix+JSPROGRAM
            self.execs = self.prefix+EXECS
            self.mm = FORMAL_MODEL

            if not os.path.exists(self.prefix):
                os.makedirs(self.prefix)

            if self.jsdir:
                if not os.path.exists(self.jsdir):
                    os.makedirs(self.jsdir)
                

def graphviz_gen(gfile, pngfile):
    command = "neato -Tpng -o%s %s"%(pngfile, gfile)
    try:
        subprocess.Popen(command.split(), stdout=subprocess.PIPE)
    except:
        if DEBUG: raise
        raise UnreachableCodeException("ERROR: execution of \"%s\" failed"%(command))

            
def main(config):
    config.generate_filenames()

    parser = BeParser()
    c4printer = PrintersFactory.printer_by_name(CVC4Printer().NAME)

    abspath = os.path.abspath(__file__)
    mm = ("/".join(abspath.split("/")[:-1]))+"/"+config.mm

    if config.verbosity > 0:
        print("** Running with path \"%s\" **\n"%(config.prefix))

    # Parsing of the bounded execution #
    with open(config.inputfile, "r") as f:
        program = parser.program_from_string(f.read())

    if config.verbosity > 0:
        sys.stdout.write("Generating bounded execution... ")
        sys.stdout.flush()
        
    if not os.path.exists(config.prefix):
        os.makedirs(config.prefix)
        
    if config.verbosity > 0:
        sys.stdout.write("DONE\n")
        sys.stdout.flush()
        
    if config.verbosity > 0:
        sys.stdout.write("Generating SMT model... ")
        sys.stdout.flush()

    # Copy of Memory Model (CVC4) into the directory #
    with open(mm, "r") as inmm:
        with open(config.model, "w") as outmm:
            outmm.write(inmm.read())

    # Generation of the CVC4 bounded execution #
    with open(config.instance, "w") as f:
        f.write(c4printer.print_program(program))

    # Generation of the CVC4 memory blocks #
    with open(config.block_type, "w") as f:
        f.write(c4printer.print_block_type(program))

    # Generation of the CVC4 memory events #
    with open(config.id_type, "w") as f:
        f.write(c4printer.print_data_type(program))

    if program.has_conditions():
        if not config.defines:
            config.defines = ""
        config.defines += E_CONDITIONS
        
    # Preprocessing the model using cpp #
    cpppre = ExtPreprocessor(CPP)
    cpppre.set_output_file(config.model_ex)
    cpppre.set_defines(config.defines)
    strmodel = cpppre.preprocess_from_file(config.model)

    # Preprocessing the quantifiers #
    qupre = QuantPreprocessor()
    qupre.set_verbosity(config.verbosity)
    qupre.set_expand_sets(config.expand_bounded_sets)
    strmodel = qupre.preprocess_from_string(strmodel)

    # Generation of the expanded CVC4 model into the directory #
    with open(config.model_ex, "w") as f:
        f.write(strmodel)

    if config.verbosity > 0:
        sys.stdout.write("DONE\n")
        sys.stdout.flush()

    if config.only_model:
        sys.exit(0)

    # Running the solver to generate all sat models #
    c4solver = CVC4Solver()
    c4solver.verbosity = config.verbosity

    if program.has_conditions:
        c4solver.set_additional_variables(program.get_conditions())
        
    if True: #not config.sat:
        c4solver.models_file = config.models

    totmodels = c4solver.get_models_size()
        
    if not config.skip_solving:
        if config.verbosity > 0:
            sys.stdout.write("Solving... ")
            sys.stdout.flush()
        
        if config.sat:
            totmodels = c4solver.solve_n(strmodel, 1)
        else:
            totmodels = c4solver.solve_all(strmodel)

        if config.verbosity > 0:
            sys.stdout.write("DONE\n")
            sys.stdout.flush()

        if not config.debug:
            os.remove(config.block_type)
            os.remove(config.model)
            os.remove(config.model_ex)
            os.remove(config.id_type)
            os.remove(config.instance)
            
    if config.verbosity > 0:
        if totmodels > 0:
            print(" -> Found %s total models"%(totmodels))
        else:
            print(" -> No viable executions found")
        
    # Generation of the JS litmus test #
    jprinter = PrintersFactory.printer_by_name(config.jsprinter)
    dprinter = PrintersFactory.printer_by_name(DotPrinter().NAME)
    dprinter.set_printing_relations(config.printing_relations)

    prefix = config.prefix
    params = program.get_params()
    models = config.models
    for idparam in range(program.param_size()):

        if program.params:
            config.prefix = "%sparam%03d/"%(prefix, idparam+1)
            config.generate_filenames()
            program.apply_param(dict(params[idparam]))

            if config.verbosity > 0:
                conf = params[idparam]
                pconf = ["%s=\"%s\""%(x[0], x[1]) for x in conf]
                print("\nParameter configuration (%03d): %s"%(idparam+1, (", ".join(pconf))))


        executions = None
        if (totmodels > 0) and (not config.sat):
            if config.verbosity > 0:
                sys.stdout.write("Computing expected outputs... ")
                sys.stdout.flush()

            with open(models, "r") as modelfile:
                executions = parser.executions_from_string(modelfile.read())

            if config.verbosity > 0:
                sys.stdout.write("DONE\n")
                sys.stdout.flush()
                
                
        if config.verbosity > 0:
            sys.stdout.write("Generating JS program... ")
            sys.stdout.flush()

        with open(config.jsprogram, "w") as f:
            f.write(jprinter.print_program(program, executions))
        
        if config.jsdir:
            jsprogram = "%s/%s"%(config.jsdir, config.jsprogram.replace("/","-"))
            with open(jsprogram, "w") as f:
                f.write(jprinter.print_program(program, executions))

        if config.verbosity > 0:
            sys.stdout.write("DONE\n")
            sys.stdout.flush()

        if (totmodels > 0) and (not config.sat):
            if config.verbosity > 0:
                sys.stdout.write("Generating expected outputs... ")
                sys.stdout.flush()

            jsexecs = []

            with open(config.execs, "w") as exefile:
                jsexecs = jprinter.compute_possible_executions(program, executions)
                exefile.write("\n".join(jsexecs))

            # Generation of all possible outputs for the JS litmus test #
            with open(config.execs, "w") as exefile:
                jsexecs = jprinter.compute_possible_executions(program, executions)
                exefile.write("\n".join(jsexecs))

            # Generation of all possible MM interpretations #
            mms = dprinter.print_executions(program, executions)
            for i in range(len(mms)):
                with open(config.dots%(str(i+1)), "w") as dot:
                    dot.write(mms[i])
                if config.graphviz:
                    with open(config.grap%(str(i+1)), "w") as dot:
                        graphviz_gen(config.dots%(str(i+1)), config.grap%(str(i+1)))

            if config.verbosity > 0:
                sys.stdout.write("DONE\n")
                sys.stdout.flush()

            if config.verbosity > 0:
                print(" -> Found %s total possible outputs"%(len(jsexecs)))
            
    if (config.verbosity > 0):
        print("\nExiting...")
        
        
if __name__ == "__main__":

    preproc = None
    cpp_preproc = True
    expand_bounded_sets = True
    verbosity = 0
    defines = ""
        
    parser = argparse.ArgumentParser(description='EMME: ECMAScript Memory Model Evaluatior')

    
    parser.add_argument('input_file', metavar='program', type=str, 
                       help='the input file describing the program')
    

    jsprinters = [x.NAME for x in PrintersFactory.get_printers_by_type(PrinterType.JS)]
    djsprinter = JSV8Printer().NAME

    parser.set_defaults(jsprinter=djsprinter)
    parser.add_argument('-j', '--jsprinter', metavar='jsprinter', type=str, nargs='?',
                        help='select the JS printer between \"%s\". (Default is \"%s\")'%("|".join(jsprinters), djsprinter))

    parser.set_defaults(jsdir=None)
    parser.add_argument('-a', '--jsdir', metavar='jsdir', type=str, nargs='?',
                        help='directory where to store all JS programs. (Default is the same as the input file)')
    
    parser.set_defaults(verbosity=1)
    parser.add_argument('-v', dest='verbosity', metavar="verbosity", type=int,
                        help="verbosity level. (Default is \"%s\")"%1)

    parser.set_defaults(check_sat=False)
    parser.add_argument('-s', '--only-sat', dest='check_sat', action='store_true',
                        help="performs only the satisfiability checking. (Default is \"%s\")"%False)

    parser.set_defaults(only_model=False)
    parser.add_argument('-m', '--only-model', dest='only_model', action='store_true',
                        help="exists right after the model generation. (Default is \"%s\")"%False)

    parser.set_defaults(skip_solving=False)
    parser.add_argument('-k', '--skip-solving', dest='skip_solving', action='store_true',
                        help="skips the solving part. (Default is \"%s\")"%False)

    parser.set_defaults(debug=False)
    parser.add_argument('-d', '--debug', dest='debug', action='store_true',
                        help="enables debugging setup. (Default is \"%s\")"%False)
    
    parser.set_defaults(expand_bounded_sets=True)
    parser.add_argument('-n','--no-exbounded', dest='expand_bounded_sets', action='store_false',
                        help="disables the bounded sets quantifier expansion. (Default is \"%s\")"%True)

    parser.set_defaults(graphviz=False)
    parser.add_argument('-g', '--graphvis', dest='graphviz', action='store_true',
                        help="generates the png files of each execution (requires neato). (Default is \"%s\")"%False)

    parser.set_defaults(prefix=None)
    parser.add_argument('-p', '--prefix', metavar='prefix', type=str, nargs='?',
                        help='directory where to store the results. (Default is the same as the input file)')

    parser.set_defaults(printing_relations=",".join([RF,HB,SW]))
    parser.add_argument('--printing-relations', metavar='printing_relations', type=str, nargs='?',
                        help='the (comma separated) list of relations to consider in the graphviz file. Keyword \"%s\" means all.'%ALL)
    
    parser.set_defaults(preproc=None)
    parser.add_argument('--preproc', metavar='preproc', type=str, nargs='?',
                        help='the memory model preprocessor. (Default is \"%s\")'%CPP)

    parser.set_defaults(defines=None)
    parser.add_argument('--defines', metavar='defines', type=str, nargs='?',
                        help='the set of preprocessor\'s defines. (Default is none)')
    
    parser.set_defaults(cpp_preproc=True)
    parser.add_argument('--no-cpp', dest='cpp_preproc', action='store_false',
                        help="disables the call of the cpp preprocessor. (Default is \"%s\")"%True)
    

    args = parser.parse_args()

    prefix = args.prefix
    preproc = args.preproc
    
    if args.cpp_preproc and (not preproc):
        preproc = CPP

    if not prefix:
        prefix = args.input_file.split("/")
        prefix[-1] = prefix[-1].split(".")[0]
        prefix = "/".join(prefix)
        prefix += "/"
        

    if not os.path.exists(args.input_file):
        print("File not found: \"%s\""%args.input_file)
        sys.exit(1)
    
    config = Config()
    config.inputfile = args.input_file
    config.prefix = prefix
    config.preproc = preproc
    config.expand_bounded_sets = args.expand_bounded_sets
    config.verbosity = args.verbosity
    config.defines = args.defines
    config.sat = args.check_sat
    config.only_model = args.only_model
    config.skip_solving = args.skip_solving
    config.jsprinter = args.jsprinter
    config.printing_relations = args.printing_relations
    if args.printing_relations == ALL:
        config.printing_relations = None

    config.graphviz = args.graphviz
    config.jsdir = args.jsdir
    config.debug = args.debug

    DEBUG = config.debug
    
    try:
        main(config)
    except Exception as e:
        if DEBUG: raise
        print(e)
        sys.exit(1)

