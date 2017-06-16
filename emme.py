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

from ecmasab.parsing import BeParser
from ecmasab.printers import JST262_SR_Printer, DotPrinter, PrintersFactory, PrinterType, BePrinter
from ecmasab.encoders import CVC4Encoder, AlloyEncoder
from ecmasab.execution import RBF, HB, SW
from ecmasab.exceptions import UnreachableCodeException
from ecmasab.analyzers import ValidExecutionAnalyzer, EquivalentExecutionSynthetizer, ConstraintsAnalyzer

from ecmasab.preprocess import ExtPreprocessor, QuantPreprocessor, CPP
from ecmasab.solvers import CVC4Solver

from ecmasab.logger import Logger


CVC_FORMAL_MODEL = "./model/memory_model.cvc"
ALL_FORMAL_MODEL = "./model/memory_model.als"

CVC_MEMORY_MODEL = "memory_model.cvc"
CVC_MEMORY_MODEL_EX = "memory_model_expanded.cvc"
ALL_MEMORY_MODEL = "memory_model.als"
ALL_MEMORY_MODEL_EX = "memory_model_expanded.als"
INSTANCE = "instance.cvc"
BLOCK_TYPE = "block_type.cvc"
ID_TYPE = "id_type.cvc"
MODELS = "models.txt"
DOTS = "mm%s.dot"
GRAP = "gmm%s.png"
JSPROGRAM = "program.js"
EXECS = "outputs.txt"
EQPROGS = "%s_eq%s.bex"

ALL = "all"

E_CONDITIONS = ",ENCODE_CONDITIONS=1"
RELAX_AO = ",en_relaxed_AO=1"
CONS_LABELLING = ",LABELLING=1"

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
    threads = None
    synth = None
    use_alloy = None
    
    cvc_model = None
    cvc_model_ex = None
    alloy_model = None
    alloy_model_ex = None
    instance = None
    block_type = None
    id_type = None
    models = None
    dots = None
    grap = None
    jsprogram = None
    execs = None
    cvc_mm = None
    alloy_mm = None
    eqprogs = None
    jsengine = None
    runs = None
    nexecs = None
    
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
        self.jsprinter = JST262_SR_Printer().NAME
        self.graphviz = None
        self.printing_relations = ",".join([RBF,HB,SW])
        self.jsdir = None
        self.debug = False
        self.force_solving = False
        self.threads = 1
        self.synth = False
        self.unmatched = False
        self.jsengine = None
        self.runs = 10
        self.nexecs = -1
        self.use_alloy = False
        
    def generate_filenames(self):
        if self.prefix:
            self.cvc_model = self.prefix+CVC_MEMORY_MODEL
            self.cvc_model_ex = self.prefix+CVC_MEMORY_MODEL_EX
            self.alloy_model = self.prefix+ALL_MEMORY_MODEL
            self.alloy_model_ex = self.prefix+ALL_MEMORY_MODEL_EX
            self.instance = self.prefix+INSTANCE
            self.block_type = self.prefix+BLOCK_TYPE
            self.id_type = self.prefix+ID_TYPE
            self.models = self.prefix+MODELS
            self.dots = self.prefix+DOTS
            self.grap = self.prefix+GRAP
            self.jsprogram = self.prefix+JSPROGRAM
            self.execs = self.prefix+EXECS
            self.cvc_mm = CVC_FORMAL_MODEL
            self.alloy_mm = ALL_FORMAL_MODEL
            self.eqprogs = self.prefix+EQPROGS

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

def parse_program(config):
    parser = BeParser()
    parser.DEBUG = config.debug
    
    # Parsing of the bounded execution #
    with open(config.inputfile, "r") as f:
        program = parser.program_from_string(f.read())
        
    if not os.path.exists(config.prefix):
        os.makedirs(config.prefix)

    return program
    
def generate_cvc_model(config, program):
    abspath = os.path.abspath(__file__)
    cvc_mm = ("/".join(abspath.split("/")[:-1]))+"/"+config.cvc_mm

    c4printer = CVC4Encoder()
    
    # Copy of Memory Model (CVC4) into the directory #
    with open(cvc_mm, "r") as inmm:
        with open(config.cvc_model, "w") as outmm:
            outmm.write(inmm.read())

    # Generation of the CVC4 bounded execution #
    with open(config.instance, "w") as f:
        f.write(c4printer.print_program(program, config.synth))

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
    cpppre.set_output_file(config.cvc_model_ex)
    cpppre.set_defines(config.defines)
    strmodel = cpppre.preprocess_from_file(config.cvc_model)

    # Preprocessing the quantifiers #
    qupre = QuantPreprocessor()
    qupre.set_verbosity(config.verbosity)
    qupre.set_expand_sets(config.expand_bounded_sets)
    strmodel = qupre.preprocess_from_string(strmodel)

    # Generation of the expanded CVC4 model into the directory #
    with open(config.cvc_model_ex, "w") as f:
        f.write(strmodel)

    return strmodel

def generate_alloy_model(config, program):
    abspath = os.path.abspath(__file__)
    alloy_mm = ("/".join(abspath.split("/")[:-1]))+"/"+config.alloy_mm

    aprinter = AlloyEncoder()
    
    with open(alloy_mm, "r") as f:
        strmodel = f.read()

    strmodel += aprinter.print_program(program, config.synth)
    
    # Generation of the expanded CVC4 model into the directory #
    with open(config.alloy_model, "w") as f:
        f.write(strmodel)

    return strmodel

def solve(config, program, strmodel):
    analyzer = ValidExecutionAnalyzer()
    analyzer.set_models_file(config.models)
    
    if (not config.skip_solving) and (config.force_solving):
        del_file(config.models)
    
    totmodels = analyzer.get_models_size()

    if ((not config.skip_solving) and (not analyzer.is_done())):
        if config.sat:
            totmodels = analyzer.solve_one_cvc4(strmodel, program)
        else:
            if config.use_alloy:
                totmodels = analyzer.solve_all_alloy(strmodel, program, config.nexecs, config.threads)
            else:
                totmodels = analyzer.solve_all_cvc4(strmodel, program, config.nexecs, config.threads)

    return totmodels

def unmatched_analysis(config):
    analyzer = ConstraintsAnalyzer()
    analyzer.set_models_file(config.models)

    Logger.log("\n** Unmatched Outputs Analysis **", 0)
    
    config.unmatched = True
    
    if not config.defines:
        config.defines = ""
    config.defines += CONS_LABELLING

    program = parse_program(config)
    
    Logger.msg("Generating model... ", 0)
    strmodel = generate_cvc_model(config, program)
    Logger.log("DONE", 0)

    if config.only_model:
        return 0

    programs = analyzer.analyze_constraints(strmodel, \
                                            config.jsengine, \
                                            config.runs, \
                                            config.threads, \
                                            config.jsprogram)

    return 0
    
def synth_program(config):
    analyzer = EquivalentExecutionSynthetizer()
    analyzer.set_models_file(config.models)
    
    Logger.log("\n** Equivalent Programs Synthesis **", 0)
    
    config.synth = True
    
    if not config.defines:
        config.defines = ""
    config.defines += RELAX_AO

    program = parse_program(config)
    if program.has_conditions():
        Logger.msg("Program synthesis does not support conditional programs", 0)
        return 0
    
    Logger.msg("Generating relaxed SMT model... ", 0)
    strmodel = generate_cvc_model(config, program)
    Logger.log("DONE", 0)

    if config.only_model:
        return 0

    Logger.msg("Solving... ", 0)

    programs = analyzer.solve_all_synth(strmodel, program, config.threads)
    totmodels = len(programs)

    Logger.log(" DONE", 0)
    
    if totmodels > 0:
        Logger.log(" -> Found %s equivalent programs"%(totmodels), 0)
    else:
        Logger.log(" -> No viable equivalent programs found", 0)

    Logger.msg("Generating equivalent programs... ", 0)
        
    printer = PrintersFactory.printer_by_name(BePrinter.NAME)
    filename = (config.inputfile.split("/")[-1]).split(".")[0]
    
    for i in range(len(programs)):
        with open(config.eqprogs%(filename, str(i+1)), "w") as eqprog:
            eqprog.write(printer.print_program(programs[i]))
        

    Logger.log("DONE", 0)
            
    Logger.log("", 1)

    Logger.log("** Original Program: **\n", 1)
    Logger.log(printer.print_program(program), 1)
    
    for program in programs:
        Logger.log("** Equivalent Program %s: **\n"%(programs.index(program)+1), 1)
        Logger.log(printer.print_program(program), 1)

    return 0

def analyze_program(config):
    config.generate_filenames()
    
    Logger.log("\n** Program Analysis **", 0)

    Logger.msg("Generating bounded execution... ", 0)
    program = parse_program(config)
    Logger.log("DONE", 0)
    
    Logger.msg("Generating model... ", 0)
    if config.use_alloy:
        strmodel = generate_alloy_model(config, program)
    else:
        strmodel = generate_cvc_model(config, program)
    Logger.log("DONE", 0)

    if config.only_model:
        return 0

    if (not config.skip_solving):
        Logger.msg("Solving... ", 0)

    totmodels = solve(config, program, strmodel)

    if (not config.skip_solving):
        Logger.log(" DONE", 0)
            
    if totmodels > 0:
        Logger.log(" -> Found %s possible models"%(totmodels), 0)
    else:
        Logger.log(" -> No viable executions found", 0)
        
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
                Logger.log("\nParameter configuration (%03d): %s"%(idparam+1, (", ".join(pconf))), 0)

        executions = None
        if (totmodels > 0):
            Logger.msg("Computing expected outputs... ", 0)

            parser = BeParser()
            parser.DEBUG = config.debug
            
            with open(models, "r") as modelfile:
                executions = parser.executions_from_string(modelfile.read(), program)
                
            Logger.log("DONE", 0)
                
        Logger.msg("Generating JS program... ", 0)

        jsfiles = [config.jsprogram]
        if config.jsdir:
            jsprogram = "%s/%s"%(config.jsdir, config.jsprogram.replace("/","-"))
            jsfiles = [jsprogram]

        for jsfile in jsfiles:    
            with open(jsfile, "w") as f:
                f.write(jprinter.print_program(program, executions))

        Logger.log("DONE", 0)

        if (totmodels > 0):
            Logger.msg("Generating expected outputs... ", 0)

            # Generation of all possible outputs for the JS litmus test #
            
            jsexecs = jprinter.compute_possible_executions(program, executions)

            if config.debug:
                with open(config.execs, "w") as exefile:
                    exefile.write("\n".join(jsexecs))

            # Generation of all possible MM interpretations #
            mms = dprinter.print_executions(program, executions)
            for i in range(len(mms)):
                with open(config.dots%(str(i+1)), "w") as dot:
                    dot.write(mms[i])
                if config.graphviz:
                    with open(config.grap%(str(i+1)), "w") as dot:
                        graphviz_gen(config, config.dots%(str(i+1)), config.grap%(str(i+1)))

            Logger.log("DONE", 0)

            Logger.log(" -> Found %s total possible outputs"%(len(jsexecs)), 0)

    return 0
        

def main(args):
    parser = argparse.ArgumentParser(description='EMME: ECMAScript Memory Model Evaluator', formatter_class=RawTextHelpFormatter)
    
    parser.add_argument('input_file', metavar='program', type=str, 
                       help='the input file describing the program')

    config = Config()
    
    jsprinters = [" - \"%s\": %s"%(x.NAME, x.DESC) for x in PrintersFactory.get_printers_by_type(PrinterType.JS)]
    jsprinters.sort()

    parser.set_defaults(jsprinter=config.jsprinter)
    parser.add_argument('-p', '--jsprinter', metavar='jsprinter', type=str, nargs='?', 
                        help='select the JS printer between (Default is \"%s\"):\n%s'%(config.jsprinter, "\n".join(jsprinters)))

    parser.set_defaults(jsdir=None)
    parser.add_argument('-d', '--jsdir', metavar='jsdir', type=str, nargs='?',
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

    parser.set_defaults(use_alloy=False)
    parser.add_argument('-a', '--use-alloy', dest='use_alloy', action='store_true',
                        help="relies on Alloy analyzer instead of CVC4. (Default is \"%s\")"%False)
    
    parser.set_defaults(nexecs=-1)
    parser.add_argument('-e', '--max-executions', dest='nexecs', metavar='nexecs', type=int,
                       help='maximum number of executions. (Default is \"unlimited\")')
    
    parser.set_defaults(verbosity=1)
    parser.add_argument('-v', dest='verbosity', metavar="verbosity", type=int,
                        help="verbosity level. (Default is \"%s\")"%1)
    
    parser.set_defaults(relations=config.printing_relations)
    parser.add_argument('-r', '--relations', metavar='relations', type=str, nargs='?',
                        help='a (comma separated) list of relations to consider in the graphviz file. Keyword \"%s\" means all.'%ALL)

    parser.set_defaults(prefix=None)
    parser.add_argument('-x', '--prefix', metavar='prefix', type=str, nargs='?',
                        help='directory where to store the results. (Default is the same as the input file)')

    parser.set_defaults(silent=False)
    parser.add_argument('-l', '--silent', dest='silent', action='store_true',
                        help="silent mode. (Default is \"%s\")"%False)
    
    parser.set_defaults(check_sat=False)
    parser.add_argument('-s', '--only-sat', dest='check_sat', action='store_true',
                        help="performs only the satisfiability checking. (Default is \"%s\")"%False)

    parser.set_defaults(only_model=False)
    parser.add_argument('-m', '--only-model', dest='only_model', action='store_true',
                        help="exits right after the model generation. (Default is \"%s\")"%False)

    parser.set_defaults(threads=1)
    parser.add_argument('-j', '--threads', metavar='number', type=int,
                       help='number of threads - EXPERIMENTAL. (Default is \"1\")')

    parser.set_defaults(debug=False)
    parser.add_argument('--debug', dest='debug', action='store_true',
                        help="enables debugging setup. (Default is \"%s\")"%False)

    parser.set_defaults(synth=False)
    parser.add_argument('--synth', dest='synth', action='store_true',
                        help="enables equivalent programs synthesis. (Default is \"%s\")"%False)

    parser.set_defaults(unmatched=False)
    parser.add_argument('--unmatched', dest='unmatched', action='store_true',
                        help="enables unmatched outputs analysis. (Default is \"%s\")"%False)

    parser.set_defaults(jsengine="")
    parser.add_argument('--jsengine', metavar='jsengine', type=str, nargs='?',
                        help='the command used to call the JavaScript engine.')

    parser.set_defaults(runs=10)
    parser.add_argument('-n', '--runs', metavar='runs', type=str,
                       help='number of runs for the unmatched outputs analysis. (Default is \"10\")')
    
    parser.set_defaults(no_expand_bounded_sets=False)
    parser.add_argument('--no-exbounded', dest='no_expand_bounded_sets', action='store_true',
                        help="disables the bounded sets quantifier expansion. (Default is \"%s\")"%False)
    
    parser.set_defaults(defines=None)
    parser.add_argument('--defines', metavar='defines', type=str, nargs='?',
                        help='the set of preprocessor\'s defines. (Default is none)')

    parser.set_defaults(preproc=CPP)
    parser.add_argument('--preproc', metavar='preproc', type=str, nargs='?',
                        help='the memory model preprocessor. (Default is \"%s\")'%CPP)

    args = parser.parse_args(args)

    prefix = args.prefix

    if not prefix:
        prefix = args.input_file.split("/")
        prefix[-1] = prefix[-1].split(".")[0]
        prefix = "/".join(prefix)
        prefix += "/"

    if not os.path.exists(args.input_file):
        print("File not found: \"%s\""%args.input_file)
        return 1

    if config.unmatched and not config.jsengine:
        print("JavaScript engine not specified")
        return 1
    
    config.inputfile = args.input_file
    config.prefix = prefix
    config.preproc = args.preproc
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
    config.threads = args.threads
    config.jsengine = args.jsengine
    config.runs = args.runs
    config.nexecs = args.nexecs
    config.use_alloy = args.use_alloy

    if args.silent:
        config.verbosity = 0

    Logger.verbosity = config.verbosity

    Logger.log("** Processing file \"%s\" **"%(config.inputfile), -1)
    
    try:
        ret = -1
        ret = analyze_program(config)
        
        if ret == 0 and args.synth:
            ret = synth_program(config)
        if ret == 0 and args.unmatched:
            ret = unmatched_analysis(config)

        #cleanup
        if not config.debug:
            del_file(config.block_type)
            del_file(config.alloy_model)
            del_file(config.cvc_model)
            del_file(config.cvc_model_ex)
            del_file(config.id_type)
            del_file(config.instance)
            
        Logger.log("\nExiting...", 0)
        return ret
    except Exception as e:
        if config.debug: raise
        print(e)
        return 1
    
if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

