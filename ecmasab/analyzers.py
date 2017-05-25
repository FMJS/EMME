# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import re
import random
from ecmasab.solvers import CVC4Solver, BDDSolver, ModelsManager
from ecmasab.logger import Logger
from ecmasab.encoders import CVC4Encoder
from ecmasab.parsing import BeParser
from ecmasab.execution import Memory_Event, Relation, Executions, Execution, RELATIONS, AO, RF, RBF
from ecmasab.preprocess import QuantPreprocessor

from CVC4 import EQUAL, AND, NOT
from litmus import Config, litmus

LABELLING_VARS = []
LABELLING_VARS.append("L_HB4a")
LABELLING_VARS.append("L_HB4b")
LABELLING_VARS.append("L_HB4c")
LABELLING_VARS.append("L_HB4d")

LABELLING_VARS.append("L_RF_implies_HB")

class ValidExecsModelsManager(ModelsManager):

    relations = RELATIONS
    variables = []
    encoder = CVC4Encoder()
    shuffle_constraints = False
    program = None
    blocking_relations = [RF]

    def set_additional_variables(self, variables):
        self.variables = variables
        
    def __gen_memory_event(self, expression):
        TYPE = "_Type"
        OCP = "\(|\)"
        OCS = "{|}"
        ES = ""
        SP = " "

        name = re.sub(TYPE+"|"+OCP, ES, expression.getChild(0).toString())
        operation = re.sub(OCP, ES, expression.getChild(1).toString())
        tear = re.sub(OCP, ES, expression.getChild(2).toString())
        ordering = re.sub(OCP, ES, expression.getChild(3).toString())
        block = re.sub(OCP, ES, expression.getChild(4).toString())
        address = re.sub(SP+"|"+OCP+"|"+OCS, ES, expression.getChild(5).toString()).split("|")
        values = None

        me = Memory_Event()
        me.name = name
        me.operation = operation
        me.tear = tear
        me.ordering = ordering
        me.address = address
        me.block = block
        me.values = values
        
        return me

    def __get_all_tuples(self, expression, tuples):
        if expression.isNull():
            return

        if expression.getType().isTuple():
            tuples.append(expression)
        else:
            for child in expression.getChildren():
                self.__get_all_tuples(child, tuples)

        return tuples
    
    def __relation_from_formula(self, name, expression):
        relation = Relation(name)

        tuples = self.__get_all_tuples(expression, [])
        for tup in tuples:
            el = []
            for i in range(len(tup.getChildren())):
                if tup.getChild(i).getType().isTuple():
                    el.append(self.__gen_memory_event(tup.getChild(i).getChild(0)).name)
                    el.append(self.__gen_memory_event(tup.getChild(i).getChild(1)).name)
                elif tup.getChild(i).getType().isInteger():
                    el.append(int(tup.getChild(i).toString()))
                else:
                    el.append(self.__gen_memory_event(tup.getChild(i)).name)

            relation.add_tuple(tuple(el))

        return relation
    
    def compute_from_smt(self, smt):
        assigns = self.exprmgr.mkBoolConst(True)
        exe = Execution()

        for relation in self.relations:
            assign = self.symboltable.lookup(relation)
            value = smt.getValue(assign)
            rel = self.__relation_from_formula(relation, value)
            assert(rel is not None)

            exe.set_relation_by_name(relation, rel)

            if relation in self.blocking_relations:
                assign = self.exprmgr.mkExpr(EQUAL, assign, smt.getValue(assign))
                assigns = self.exprmgr.mkExpr(AND, assigns, assign)

        for variable in self.variables:
            assign = self.symboltable.lookup(variable)
            value = smt.getValue(assign).toString()
            exe.add_condition(variable, value)

            assign = self.exprmgr.mkExpr(EQUAL, assign, smt.getValue(assign))
            assigns = self.exprmgr.mkExpr(AND, assigns, assign)

        blocking = self.exprmgr.mkExpr(NOT, assigns)

        Logger.log("Blocking: %s"%(blocking.toString()), 1)

        return ([blocking], exe)

    def compute_from_sharedobjs(self, shared_objs):
        executions = Executions()
        executions.executions = shared_objs

        assertions = "\n"+("\n".join(self.encoder.print_neg_assertions(executions, self.blocking_relations)))

        return assertions

    def write_models(self, shared_objs, done):
        if self.models_file:
            with open(self.models_file, "w") as f:
                for exe in shared_objs:
                    f.write("%s\n"%self.encoder.print_execution(exe))
                if done:
                    f.write("%s\n"%self.encoder.print_done())

    def load_models(self):
        shared_objs = []
        parser = BeParser()
        if self.models_file:
            if os.path.exists(self.models_file):
                with open(self.models_file, "r") as f:
                    shared_objs = (parser.executions_from_string(f.read())).executions
        return shared_objs

    def is_done(self):
        execs = None
        parser = BeParser()
        if self.models_file:
            if os.path.exists(self.models_file):
                with open(self.models_file, "r") as f:
                    execs = (parser.executions_from_string(f.read()))
        if execs:
            return execs.allexecs
        return False
    
    def solutions_separators(self):
        if not self.program:
            return []
        rb_set = self.encoder.get_compatible_reads(self.program)[0]
        rb_cons = ["ASSERT (%s IS_IN RF)"%(x) for x in rb_set]

        Logger.msg("(%s)"%len(rb_cons), 0)
        
        if self.shuffle_constraints:
            random.shuffle(rb_cons)

        return rb_cons


class SynthProgsModelsManager(ValidExecsModelsManager):

    preload = True

    def __init__(self):
        self.preload = True
    
    def load_models(self):
        shared_objs = []
        if not self.preload:
            return shared_objs
        parser = BeParser()
        if self.models_file:
            if os.path.exists(self.models_file):
                with open(self.models_file, "r") as f:
                    shared_objs = (parser.executions_from_string(f.read())).executions
        return shared_objs
    
    def write_models(self, shared_objs, done):
        pass
    
    def solutions_separators(self):
        if not self.program:
            return []

        ao_set = [(x.name,y.name) for x in self.program.get_events() for y in self.program.get_events() if x != y]
        ao_cons = ["ASSERT ((%s, %s) IS_IN AO)"%(x) for x in ao_set]

        Logger.msg("(%s)"%len(ao_cons), 0)
        
        if self.shuffle_constraints:
            random.shuffle(ao_cons)

        return ao_cons

    
class ValidExecutionAnalyzer(object):

    vexecsmanager = None
    c4solver = CVC4Solver()
    encoder = CVC4Encoder()

    def __init__(self):
        self.vexecsmanager = ValidExecsModelsManager()

    def set_models_file(self, models_file):
        self.vexecsmanager.models_file = models_file
        
    def get_models_size(self):
        pre_objs = self.vexecsmanager.load_models()
        return len(pre_objs)

    def is_done(self):
        return self.vexecsmanager.is_done()
    
    def solve_all(self, model, program=None, threads=1):
        self.vexecsmanager.program = program
        if program.has_conditions:
            self.vexecsmanager.set_additional_variables(program.get_conditions())

        ret = self.c4solver.solve_allsmt(model, self.vexecsmanager, -1, threads)
        return len(ret)

    def solve_one(self, model, program=None):
        self.vexecsmanager.program = program
        if program.has_conditions:
            self.vexecsmanager.set_additional_variables(program.get_conditions())
        
        ret = self.c4solver.solve_allsmt(model, self.vexecsmanager, 1)
        return len(ret)


class EquivalentExecutionSynthetizer(object):

    vexecsmanager = None
    c4solver = CVC4Solver()
    encoder = CVC4Encoder()

    def __init__(self):
        self.vexecsmanager = SynthProgsModelsManager()

    def set_models_file(self, models_file):
        self.vexecsmanager.models_file = models_file

    def __check_ao_correctness(self, model, exe, executions):
        ok = True

        prev_blocking = self.vexecsmanager.blocking_relations
        self.vexecsmanager.blocking_relations = [RF]
        
        assertions = self.encoder.print_neg_assertions(executions, self.vexecsmanager.blocking_relations)

        # Checking if the candidate is not a superset
        assertion = "\n"+("\n".join(assertions))
        vmodel = model+assertion
        vmodel += "\nASSERT (%s);\n"%(exe.replace("{}", "empty_rel_set"))
        ret = self.c4solver.solve_allsmt(vmodel, self.vexecsmanager, 1)
        if ret != []:
            ok = False

        # Checking if the candidate mathces all executions
        if ok and (len(assertions) > 1):
            for assertion in assertions:
                vmodel = model+"\n"+assertion+"\n"
                vmodel += "\nASSERT (%s);\n"%(exe)
                ret = self.c4solver.solve_allsmt(vmodel, self.vexecsmanager, 1)
                if ret == []:
                    ok = False
                    break

        self.vexecsmanager.blocking_relations = prev_blocking
                
        return ok
    
    def solve_all_synth(self, model, program, threads):
        self.vexecsmanager.program = program
        executions = Executions()
        executions.executions = self.vexecsmanager.load_models()
        self.vexecsmanager.preload = False        

        encoder = CVC4Encoder()
        assertions = encoder.print_ex_assertions(executions, [RF, RBF])
        vmodel = model+"\n"+assertions+"\n"
        vmodel += encoder.print_general_AO(program)

        qupre = QuantPreprocessor()
        qupre.set_expand_sets(True)
        vmodel = qupre.preprocess_from_string(vmodel)

        self.vexecsmanager.blocking_relations = [AO]
        ao_execs = self.c4solver.solve_allsmt(vmodel, self.vexecsmanager, -1, threads)

        Logger.msg(" ", 0)
        Logger.log(" -> Found %s possible candidates"%(len(ao_execs)), 1)
        Logger.msg("Checking correctness... ", 1)

        beparser = BeParser()
        eq_progs = []
        equivalent_AOs = []
        events_dic = dict([(x.name, x) for x in program.get_events()])
        
        for exe in ao_execs:
            ok = self.__check_ao_correctness(model, str(exe.get_AO()), executions)
            if ok:
                rel = Relation(AO)
                rel.tuples = [(events_dic[x[0]], events_dic[x[1]]) for x in exe.get_AO().tuples]
                exe.set_AO(rel)
                exe.program = program
                equivalent_AOs.append(exe)
                program = beparser.program_from_execution(exe)
                eq_progs.append(program)

        Logger.log(" DONE", 1)
        for el in equivalent_AOs:
            Logger.log("OK: %s"%el.get_AO(), 1)

        return eq_progs
    
class ConstraintAnalyzerManager(ModelsManager):

    def compute_from_smt(self, smt):
        assigns = self.exprmgr.mkBoolConst(True)
        
        model = []

        for varstr in LABELLING_VARS:
            assign = self.symboltable.lookup(varstr)
            value = smt.getValue(assign)
            model.append("%s%s"%("" if value.getConstBoolean() else "~", assign.toString()))
            
            assign = self.exprmgr.mkExpr(EQUAL, assign, smt.getValue(assign))
            assigns = self.exprmgr.mkExpr(AND, assigns, assign)

        blocking = self.exprmgr.mkExpr(NOT, assigns)
        
        Logger.log("Blocking: %s"%(blocking.toString()), 1)
        
        return ([blocking], "(%s)"%" & ".join(model))

    def compute_from_sharedobjs(self, shared_objs):
        if shared_objs == []:
            return ""
        models = " OR ".join([x.replace("~","NOT ").replace("&","AND") for x in shared_objs])
        return "ASSERT NOT(%s);"%(models)

    def write_models(self, shared_objs, done):
        pass

    def load_models(self):
        return []
    
    def solutions_separators(self):
        pass

    
class ConstraintsAnalyzer(object):

    c4solver = None
    bsolver = None

    def set_models_file(self, models_file):
        self.vexecsmanager.models_file = models_file
    
    def __init__(self):
        self.c4solver = CVC4Solver()
        self.bsolver = BDDSolver()
        self.vexecsmanager = ConstraintAnalyzerManager()

    def analyze_constraints(self, model, program, jsengine, runs, threads, jsprogram):
        matched = []
        unmatched = []

        config = Config()
        config.command = jsengine
        config.input_file = jsprogram
        config.threads = threads
        config.number = runs
        config.silent = True
        config.models = True

        (matched, unmatched) = litmus(config)
        
        Logger.log(" -> Found %s matched models"%(len(matched)), 0)
        Logger.log(" -> Found %s unmatched models"%(len(unmatched)), 0)

        if len(unmatched) == 0:
            return
        
        matched = ["(%s)"%str(x.replace("{}", "empty_rel_set")) for x in matched]
        unmatched = ["(%s)"%str(x.replace("{}", "empty_rel_set")) for x in unmatched]

        matched = " OR ".join(matched)
        unmatched = " OR ".join(unmatched)
        
        vmodel = "%s\nASSERT %s;\n"%(model, matched)
        objs = []
        Logger.log("\nMatched models analysis", 0)
        Logger.msg("Solving... ", 0)
        objs = self.c4solver.compute_models(vmodel, self.vexecsmanager, objs)
        mmodels = " | ".join(objs)
        Logger.log(" DONE", 0)
        mmodels = self.bsolver.simplify(mmodels, True)
        Logger.log(" -> Found %s labelling solutions\n%s\n"%(len(mmodels), " | \n".join(mmodels)), 0)

        vmodel = "%s\nASSERT %s;\n"%(model, unmatched)
        objs = []
        Logger.log("Unmatched models analysis", 0)
        Logger.msg("Solving... ", 0)
        objs = self.c4solver.compute_models(vmodel, self.vexecsmanager, objs)
        nmodels = " | ".join(objs)
        Logger.log(" DONE", 0)
        nmodels = self.bsolver.simplify(nmodels, True)
        Logger.log(" -> Found %s labelling solutions\n%s\n"%(len(nmodels), " | \n".join(nmodels)), 0)

        Logger.log("Difference analysis (unmatched \\ matched)", 0)
        diffmodels = "%s & ~(%s)"%(" | ".join(nmodels), " | ".join(mmodels))
        diffmodels = self.bsolver.simplify(diffmodels, True)
        Logger.log(" -> Found %s labelling solutions\n%s"%(len(diffmodels), " | \n".join(diffmodels)), 0)

        return (mmodels, nmodels, diffmodels)
