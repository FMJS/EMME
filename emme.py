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

from argparse import RawTextHelpFormatter

from ecmasab.beparsing import BeParser
from ecmasab.printers import JSV8Printer, CVC4Printer, DotPrinter, PrintersFactory, PrinterType
from ecmasab.execution import RF, HB, SW
from ecmasab.exceptions import UnreachableCodeException

from ecmasab.preprocess import ExtPreprocessor, QuantPreprocessor, CPP
from ecmasab.solvers import CVC4Solver

from ecmasab.logger import Logger


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
    force_solving = None

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
        self.force_solving = False
        
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
                
def del_file(path):
    if os.path.exists(path):
        os.remove(path)
                    
def graphviz_gen(config, gfile, pngfile):
    command = "neato -Tpng -o%s %s"%(pngfile, gfile)
    try:
        subprocess.Popen(command.split(), stdout=subprocess.PIPE)
    except:
        if config.debug: raise
        raise UnreachableCodeException("ERROR: execution of \"%s\" failed"%(command))

def parse_program(logger, config):
    parser = BeParser()
    parser.DEBUG = config.debug
    
    # Parsing of the bounded execution #
    with open(config.inputfile, "r") as f:
        program = parser.program_from_string(f.read())
        
    if not os.path.exists(config.prefix):
        os.makedirs(config.prefix)

    return program
    
def generate_model(logger, config, program):
    abspath = os.path.abspath(__file__)
    mm = ("/".join(abspath.split("/")[:-1]))+"/"+config.mm

    c4printer = PrintersFactory.printer_by_name(CVC4Printer().NAME)
    
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

    return strmodel

def solve(logger, config, program, strmodel):
    c4solver = CVC4Solver()
    c4solver.verbosity = config.verbosity
    c4solver.models_file = config.models

    if (not config.skip_solving) and (config.force_solving):
        del_file(config.models)
    
    totmodels = c4solver.get_models_size()

    if (not config.skip_solving) and (not c4solver.is_done()):
        if program.has_conditions:
            c4solver.set_additional_variables(program.get_conditions())

        if config.sat:
            totmodels = c4solver.solve_n(strmodel, 1)
        else:
            totmodels = c4solver.solve_all(strmodel)

        if not config.debug:
            del_file(config.block_type)
            del_file(config.model)
            del_file(config.model_ex)
            del_file(config.id_type)
            del_file(config.instance)

    return totmodels

def analyze_program(config):
    config.generate_filenames()
    
    logger = Logger(config.verbosity)
    
    logger.log("** Running with path \"%s\" **\n"%(config.prefix), 0)

    logger.msg("Generating bounded execution... ", 0)
    program = parse_program(logger, config)
    logger.log("DONE", 0)

    logger.msg("Generating SMT model... ", 0)
    strmodel = generate_model(logger, config, program)
    logger.log("DONE", 0)

    if config.only_model:
        return 0

    if (not config.skip_solving):
        logger.msg("Solving... ", 0)

    totmodels = solve(logger, config, program, strmodel)

    if (not config.skip_solving):
        logger.log("DONE", 0)
            
    if totmodels > 0:
        logger.log(" -> Found %s total models"%(totmodels), 0)
    else:
        logger.log(" -> No viable executions found", 0)
        
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
                logger.log("\nParameter configuration (%03d): %s"%(idparam+1, (", ".join(pconf))), 0)

        executions = None
        if (totmodels > 0):
            logger.msg("Computing expected outputs... ", 0)

            parser = BeParser()
            parser.DEBUG = config.debug
            
            with open(models, "r") as modelfile:
                executions = parser.executions_from_string(modelfile.read(), program)
                
            logger.log("DONE", 0)
                
        logger.msg("Generating JS program... ", 0)

        jsfiles = [config.jsprogram]
        if config.jsdir:
            jsprogram = "%s/%s"%(config.jsdir, config.jsprogram.replace("/","-"))
            jsfiles.append(jsprogram)

        for jsfile in jsfiles:    
            with open(jsfile, "w") as f:
                f.write(jprinter.print_program(program, executions))

        logger.log("DONE", 0)

        if (totmodels > 0):
            logger.msg("Generating expected outputs... ", 0)

            jsexecs = []

            # Generation of all possible outputs for the JS litmus test #
            for jsfile in jsfiles:    
                with open(jsfile, "a") as f:
                    jsexecs = jprinter.compute_possible_executions(program, executions)
                    jsexecs = ["%s%s"%(jprinter.OUT, x) for x in jsexecs]
                    f.write("\n// Expected outputs //\n%s"%"\n".join(jsexecs))

            if config.debug:
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
                        graphviz_gen(config, config.dots%(str(i+1)), config.grap%(str(i+1)))

            logger.log("DONE", 0)

            logger.log(" -> Found %s total possible outputs"%(len(jsexecs)), 0)

    logger.log("\nExiting...", 0)
    
    return 0
        

def main(args):
    preproc = None
    cpp_preproc = True
    expand_bounded_sets = True
    verbosity = 0
    defines = ""
        
    parser = argparse.ArgumentParser(description='EMME: ECMAScript Memory Model Evaluatior', formatter_class=RawTextHelpFormatter)

    
    parser.add_argument('input_file', metavar='program', type=str, 
                       help='the input file describing the program')
    

    jsprinters = [" - \"%s\": %s"%(x.NAME, x.DESC) for x in PrintersFactory.get_printers_by_type(PrinterType.JS)]
    jsprinters.sort()
    djsprinter = JSV8Printer().NAME

    parser.set_defaults(jsprinter=djsprinter)
    parser.add_argument('-p', '--jsprinter', metavar='jsprinter', type=str, nargs='?', 
                        help='select the JS printer between (Default is \"%s\"):\n%s'%(djsprinter, "\n".join(jsprinters)))

    parser.set_defaults(jsdir=None)
    parser.add_argument('-j', '--jsdir', metavar='jsdir', type=str, nargs='?',
                        help='directory where to store all JS programs. (Default is the same as the input file)')
 
    parser.set_defaults(graphviz=False)
    parser.add_argument('-g', '--graphviz', dest='graphviz', action='store_true',
                        help="generates the png files of each execution (requires neato). (Default is \"%s\")"%False)

    parser.set_defaults(force_solving=False)
    parser.add_argument('-f', '--force-solving', dest='force_solving', action='store_true',
                        help="forces the solving part by discharging the previous models. (Default is \"%s\")"%False)
    
    parser.set_defaults(skip_solving=False)
    parser.add_argument('-k', '--skip-solving', dest='skip_solving', action='store_true',
                        help="skips the solving part. (Default is \"%s\")"%False)

    parser.set_defaults(relations=",".join([RF,HB,SW]))
    parser.add_argument('-r', '--relations', metavar='relations', type=str, nargs='?',
                        help='a (comma separated) list of relations to consider in the graphviz file. Keyword \"%s\" means all.'%ALL)

    parser.set_defaults(prefix=None)
    parser.add_argument('-x', '--prefix', metavar='prefix', type=str, nargs='?',
                        help='directory where to store the results. (Default is the same as the input file)')
    
    parser.set_defaults(verbosity=1)
    parser.add_argument('-v', dest='verbosity', metavar="verbosity", type=int,
                        help="verbosity level. (Default is \"%s\")"%1)

    parser.set_defaults(silent=False)
    parser.add_argument('-l', '--silent', dest='silent', action='store_true',
                        help="silent mode. (Default is \"%s\")"%False)
    
    parser.set_defaults(check_sat=False)
    parser.add_argument('-s', '--only-sat', dest='check_sat', action='store_true',
                        help="performs only the satisfiability checking. (Default is \"%s\")"%False)

    parser.set_defaults(only_model=False)
    parser.add_argument('-m', '--only-model', dest='only_model', action='store_true',
                        help="exits right after the model generation. (Default is \"%s\")"%False)

    parser.set_defaults(debug=False)
    parser.add_argument('-d', '--debug', dest='debug', action='store_true',
                        help="enables debugging setup. (Default is \"%s\")"%False)
    
    parser.set_defaults(no_expand_bounded_sets=False)
    parser.add_argument('-n','--no-exbounded', dest='no_expand_bounded_sets', action='store_true',
                        help="disables the bounded sets quantifier expansion. (Default is \"%s\")"%False)
    
    parser.set_defaults(defines=None)
    parser.add_argument('--defines', metavar='defines', type=str, nargs='?',
                        help='the set of preprocessor\'s defines. (Default is none)')

    parser.set_defaults(preproc=CPP)
    parser.add_argument('--preproc', metavar='preproc', type=str, nargs='?',
                        help='the memory model preprocessor. (Default is \"%s\")'%CPP)

    args = parser.parse_args(args)

    prefix = args.prefix
    preproc = args.preproc

    if not prefix:
        prefix = args.input_file.split("/")
        prefix[-1] = prefix[-1].split(".")[0]
        prefix = "/".join(prefix)
        prefix += "/"

    if not os.path.exists(args.input_file):
        print("File not found: \"%s\""%args.input_file)
        return 1
    
    config = Config()
    config.inputfile = args.input_file
    config.prefix = prefix
    config.preproc = preproc
    config.expand_bounded_sets = not args.no_expand_bounded_sets
    config.verbosity = args.verbosity
    config.defines = args.defines
    config.sat = args.check_sat
    config.only_model = args.only_model
    config.skip_solving = args.skip_solving
    config.jsprinter = args.jsprinter
    config.printing_relations = args.relations
    if args.relations == ALL:
        config.printing_relations = None

    config.graphviz = args.graphviz
    config.jsdir = args.jsdir
    config.debug = args.debug
    config.force_solving = args.force_solving

    if args.silent:
        config.verbosity = 0
    
    try:
        return analyze_program(config)
    except Exception as e:
        if config.debug: raise
        print(e)
        return 1
    
if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

