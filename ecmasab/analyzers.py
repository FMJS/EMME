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
import math
import configparser
from ecmasab.solvers import CVC4Solver, AlloySolver, BDDSolver, ModelsManager
from ecmasab.logger import Logger
from ecmasab.encoders import CVC4Encoder, AlloyEncoder
from ecmasab.parsing import BeParser
from ecmasab.execution import Memory_Event, Relation, Executions, Execution, \
    RELATIONS, AO, RF, RBF, MO, HB, SW
from ecmasab.preprocess import QuantPreprocessor
from multiprocessing import Process, Manager
from litmus import Config, run_litmus

try:
    from CVC4 import EQUAL, AND, NOT
except Exception:
    pass

LABELLING_VAR_PREF = "L_"
UNMATCHED_FILE = "configs/unmatched.ini"
DEFAULT = "DEFAULT"
DESCRIPTION = "description"
FORMULA = "formula"

class CVC4ValidExecsModelsManager(ModelsManager):

    relations = RELATIONS
    variables = []
    encoder = CVC4Encoder()
    shuffle_constraints = False
    program = None
    blocking_relations = [RBF]

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
                elif str(tup.getChild(i).getType().toString()) == "BINT":
                    el.append(int(re.sub("I|\(|\)", "", str(tup.getChild(i).toString()))))
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
                assign = self.exprmgr.mkExpr(EQUAL, assign, value)
                assigns = self.exprmgr.mkExpr(AND, assigns, assign)
                
        for variable in self.variables:
            assign = self.symboltable.lookup(variable)
            value = smt.getValue(assign).toString()
            exe.add_condition(variable, value)

            assign = self.exprmgr.mkExpr(EQUAL, assign, smt.getValue(assign))
            assigns = self.exprmgr.mkExpr(AND, assigns, assign)

        blocking = self.exprmgr.mkExpr(NOT, assigns)

        Logger.log("Blocking: %s"%(blocking.toString()), 2)

        return ([blocking], exe)

    def compute_from_sharedobjs(self, shared_objs):
        executions = Executions()
        executions.executions = shared_objs
        assertions = self.encoder.print_assert_neg_execs(executions, self.blocking_relations)
        Logger.log("Blocking: \n%s"%("\n".join(assertions)), 2)
        return "\n"+("\n".join(assertions))

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
        
        rf = True

        cr = self.encoder.get_compatible_reads(self.program)
        rb_cons = [self.encoder.assert_formula("(%s IS_IN RBF)"%(x)).replace("Int","") for x in cr[1]]
        
        if rf:
            rb_cons += [self.encoder.assert_formula("(%s IS_IN RF)"%(x)).replace("Int","") for x in cr[0]]
        
        Logger.msg("(%s)"%len(rb_cons), 0)
        
        if self.shuffle_constraints:
            random.shuffle(rb_cons)

        return rb_cons


class AlloyValidExecsModelsManager(CVC4ValidExecsModelsManager):
    id_blocking = 0
    encoder = None

    blocking_relations = [RBF]
    
    def __init__(self):
        self.encoder = AlloyEncoder()
    
    def compute_from_smt(self, smt):
        AlloyValidExecsModelsManager.id_blocking += 1

        exe = self.__generate_execution(smt)
        blocking = []
        for rel in self.blocking_relations:
            tuples = self.__extract_tuples(self.__relname_mapping()[rel], smt)
            if len(tuples[0]) == 0:
                blocking.append("(no %s.rel)"%(self.__relname_mapping()[rel]))
            else:
                btup = []
                for tup in tuples:
                    btup.append(" -> ".join(tuple(tup)))
                blocking.append("%s.rel = %s"%(self.__relname_mapping()[rel], " + ".join(["{(%s)}"%x for x in btup])))

        for var in self.variables:
            value = self.__get_condition(smt, var)
            if value is not None:
                blocking.append("(%s.value = %s)"%(var, value))
                exe.add_condition(var, value)
            
        blocking = "fact block_smt_%s {not (%s)}\n"%(AlloyValidExecsModelsManager.id_blocking, " and ".join(blocking))

        Logger.log("Blocking: %s"%(blocking), 2)
        
        return (blocking, exe)

    def __relname_mapping(self, inv=False):
        mapping = []
        mapping.append((RBF,"reads_bytes_from"))
        mapping.append((RF,"reads_from"))
        mapping.append((MO,"memory_order"))
        mapping.append((AO,"agent_order"))
        mapping.append((HB,"happens_before"))
        mapping.append((SW,"synchronizes_with"))
        if inv:
            mapping = dict([(x[1],x[0]) for x in mapping])
        else:
            mapping = dict(mapping)

        return mapping
    
    def compute_from_sharedobjs(self, shared_objs):
        executions = Executions()
        executions.executions = shared_objs
        constraints = self.encoder.print_assert_neg_execs(executions, self.blocking_relations)
        Logger.log("Blocking: \n%s"%("".join(constraints)), 2)
            
        return "\n".join(constraints)

    def __get_condition(self, model, condition):
        for el in model:
            if ("this/%s<:value="%condition in el):
                return str("TRUE" in el).upper()
        return None
    
    def __generate_execution(self, model):
        exe = Execution()
        bytes_name = "byte_"
        rel_map = self.__relname_mapping(True)

        for el in rel_map:
            tuples = self.__extract_tuples(el, model)
            tuples = [] if tuples == [[]] else tuples
            if len(tuples):
                if rel_map[el] == RBF:
                    tuples = [(x[0], x[2], x[1][len(bytes_name):]) \
                              for x in tuples]
            rel = Relation(rel_map[el])
            rel.tuples = tuples
            exe.set_relation_by_name(rel_map[el], rel)
            
        return exe
    
    def __extract_tuples(self, relname, model):
        rel = "this/%s<:rel="%relname
        tuples = []
        for el in model:
            if rel in el:
                el = el.replace(rel, "")
                for tuple in el.split(", "):
                    tuple = tuple[1:-1].split("->")
                    tuple = [x[:x.find("$")] for x in tuple][1:]
                    tuples.append(tuple)
        return tuples

    def solutions_separators(self):
        if not self.program:
            return []
        
        rf = True

        cr = self.encoder.get_compatible_reads(self.program)
        rb_cons = [self.encoder.assert_formula("(RBF %s)"%(x)) for x in cr[1]]
        
        if rf:
            rb_cons += [self.encoder.assert_formula("(RF %s)"%(x)) for x in cr[0]]
        
        Logger.msg("(%s)"%len(rb_cons), 0)
        
        if self.shuffle_constraints:
            random.shuffle(rb_cons)

        return rb_cons
    

class CVC4SynthProgsModelsManager(CVC4ValidExecsModelsManager):

    preload = True
    prevmodels = None
    encoder = None
    
    def __init__(self):
        self.preload = True
        self.prevmodels = None
        self.encoder = CVC4Encoder()
    
    def load_models(self):
        shared_objs = []
        if self.prevmodels is not None:
            return self.prevmodels
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
        ao_cons = [self.encoder.assert_formula("((%s, %s) IS_IN AO)"%(x)) for x in ao_set]

        Logger.msg("(%s)"%len(ao_cons), 0)
        
        if self.shuffle_constraints:
            random.shuffle(ao_cons)

        return ao_cons

class AlloySynthProgsModelsManager(AlloyValidExecsModelsManager):

    preload = True
    prevmodels = None
    encoder = None
    
    def __init__(self):
        self.preload = True
        self.prevmodels = None
        self.encoder = AlloyEncoder()
    
    def load_models(self):
        shared_objs = []
        if self.prevmodels is not None:
            return self.prevmodels
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
        ao_cons = [self.encoder.assert_formula("(AO [%s, %s])"%(x)) for x in ao_set]

        Logger.msg("(%s)"%len(ao_cons), 0)
        
        if self.shuffle_constraints:
            random.shuffle(ao_cons)

        return ao_cons
    
class ValidExecutionAnalyzer(object):

    cvc4_vexecsmanager = None
    alloy_vexecsmanager = None
    c4solver = None
    alloysolver = None
    alloyencoder = None

    def __init__(self):
        self.cvc4_vexecsmanager = CVC4ValidExecsModelsManager()
        self.alloy_vexecsmanager = AlloyValidExecsModelsManager()

        self.c4solver = CVC4Solver()
        self.alloysolver = AlloySolver()
        self.alloyencoder = AlloyEncoder()
        

    def set_models_file(self, models_file):
        self.cvc4_vexecsmanager.models_file = models_file
        self.alloy_vexecsmanager.models_file = models_file
        
    def get_models_size(self):
        pre_objs = self.cvc4_vexecsmanager.load_models()
        return len(pre_objs)

    def is_done(self):
        return self.cvc4_vexecsmanager.is_done()
    
    def solve_all_cvc4(self, model, program=None, nexecs=-1, threads=1):
        self.cvc4_vexecsmanager.program = program
        if program.has_conditions:
            self.cvc4_vexecsmanager.set_additional_variables(program.get_conditions())

        timer = Logger.start_timer("CVC4 solve all")
        ret = self.c4solver.solve_allsmt(model, self.cvc4_vexecsmanager, nexecs, threads)
        Logger.stop_timer(timer)
        return len(ret)

    def solve_one_cvc4(self, model, program=None):
        self.cvc4_vexecsmanager.program = program
        if program.has_conditions:
            self.cvc4_vexecsmanager.set_additional_variables(program.get_conditions())
        
        ret = self.c4solver.solve_allsmt(model, self.cvc4_vexecsmanager, 1)
        return len(ret)

    def solve_all_alloy(self, model, program=None, nexecs=-1, threads=1):
        self.alloy_vexecsmanager.program = program
        if program.has_conditions:
            self.alloy_vexecsmanager.set_additional_variables(program.get_conditions())
        model += self.alloyencoder.print_run_condition(program)
        timer = Logger.start_timer("Alloy solve all")
        ret = self.alloysolver.solve_allsmt(model, self.alloy_vexecsmanager, nexecs, threads)
        Logger.stop_timer(timer)
        return len(ret)

    def solve_one_alloy(self, model, program=None):
        self.alloy_vexecsmanager.program = program
        if program.has_conditions:
            self.alloy_vexecsmanager.set_additional_variables(program.get_conditions())
        
        model += self.alloyencoder.print_run_condition(program)
        ret = self.alloysolver.solve_allsmt(model, self.alloy_vexecsmanager, 1)
        return len(ret)


class EquivalentExecutionSynthetizer(object):
    cvc4_synth = None
    alloy_synth = None

    def __init__(self):
        self.cvc4_synth = EquivalentExecutionSynthetizerCVC4()
        self.alloy_synth = EquivalentExecutionSynthetizerAlloy()

    def solve_all_synth_cvc(self, model, program, threads):
        return self.cvc4_synth.solve_all_synth(model, program, threads)

    def solve_all_synth_alloy(self, model, program, threads):
        return self.alloy_synth.solve_all_synth(model, program, threads)

    def solve_all_synth_hybrid(self, cvc4model, alloymodel, program, threads):
        timer = Logger.start_timer("Alloy intersect")
        (ao_execs, executions) = self.alloy_synth.find_all_intersect(alloymodel, program, 1)
        Logger.stop_timer(timer)
        timer = Logger.start_timer("CVC4 prune equivalent")
        ret = self.cvc4_synth.prune_not_eq(ao_execs, executions, cvc4model, program, threads)
        Logger.stop_timer(timer)
        return ret
    
    def set_models_file(self, models_file):
        self.cvc4_synth.set_models_file(models_file)
        self.alloy_synth.set_models_file(models_file)
    
class EquivalentExecutionSynthetizerAlloy(object):

    allvexecsmanager = None
    alloy_solver = None
    alloy_encoder = None

    def __init__(self):
        self.allvexecsmanager = AlloySynthProgsModelsManager()
        self.alloy_solver = AlloySolver()
        self.alloy_encoder = AlloyEncoder()

    def set_models_file(self, models_file):
        self.allvexecsmanager.models_file = models_file

    def solve_all_synth(self, model, program, threads):
        timer = Logger.start_timer("Alloy intersect")
        (ao_execs, executions) = self.find_all_intersect(model, program, threads)
        Logger.stop_timer(timer)
        timer = Logger.start_timer("Alloy prune equivalent")
        ret = self.prune_not_eq(ao_execs, executions, model, program, threads)
        Logger.stop_timer(timer)
        return ret

    def find_all_intersect(self, model, program, threads):
        run_condition = self.alloy_encoder.print_run_condition(program)
        self.allvexecsmanager.program = program
        executions = Executions()
        executions.executions = self.allvexecsmanager.load_models()
        self.allvexecsmanager.preload = False        

        vmodel = "\n".join([model,self.alloy_encoder.print_general_AO(program)])
        self.allvexecsmanager.blocking_relations = [AO]
        ao_execs = []
        for models_blocking in [[RBF]]:
            assertions = self.alloy_encoder.print_assert_exl_execs(executions, models_blocking)
            vmodel += "\n%s\n"%assertions
            execs = self.alloy_solver.solve_allsmt(vmodel+run_condition, self.allvexecsmanager, -1, threads if ao_execs == [] else 1)
            ao_execs += [x for x in execs if x not in ao_execs]
            self.allvexecsmanager.prevmodels = ao_execs
            Logger.msg(" ", 0)
        self.allvexecsmanager.prevmodels = None

        Logger.log(" -> Found %s possible candidates"%(len(ao_execs)), 1)
        Logger.msg("Checking correctness... ", 1)

        if Logger.level(1):
            Logger.msg("\n", -1)
            for el in ao_execs:
                Logger.log("INTERSECTING: %s"%el.get_AO(), 1)

        return (ao_execs, executions)

    def prune_not_eq(self, ao_execs, executions, model, program, threads):
        self.allvexecsmanager.preload = False        
        beparser = BeParser()
        eq_progs = []
        equivalent_AOs = []
        events_dic = dict([(x.name, x) for x in program.get_events()])

        run_condition = self.alloy_encoder.print_run_condition(program)

        if threads > 1:
            valid_aos = self.__check_all_mt(model, ao_execs, executions, run_condition, threads)
        else:
            valid_aos = self.__check_all(model, ao_execs, executions, run_condition)
        
        for exe in valid_aos:
            rel = Relation(AO)
            rel.tuples = [(events_dic[str(x[0])], events_dic[str(x[1])]) for x in exe.get_AO().tuples]
            exe.set_AO(rel)
            exe.program = program
            equivalent_AOs.append(exe)
            program = beparser.program_from_execution(exe)
            eq_progs.append(program)

        Logger.log(" DONE", 1)
        if Logger.level(1):
            for el in equivalent_AOs:
                Logger.log("EQUIVALENT: %s"%el.get_AO(), 1)

        return eq_progs

    def __check_all_mt(self, model, ao_execs, executions, run_condition, num_t):
        num_t = min(len(ao_execs), num_t)
        size = int(math.ceil(len(ao_execs)/float(num_t)))
        ao_execs = [ao_execs[x:x+size] for x in xrange(0, len(ao_execs), size)]
        num_t = len(ao_execs)
        retlist = []
        threads = []
        
        with Manager() as manager:
            proclist = []
            for i in range(num_t):
                ret = manager.list([])
                proclist.append(ret)
                process = Process(target=self.__check_all, args=(model, ao_execs[i], executions, run_condition, ret))
                threads.append(process)
                process.start()

            for thread in threads:
                thread.join()

            for x in proclist:
                retlist += list(x)

        return list(retlist)
    
    def __check_all(self, model, ao_execs, executions, run_condition, retlist=None):
        if retlist is None: retlist = []
        for exe in ao_execs:
            ok = self.__check_ao_correctness(model, exe, executions, run_condition)
            if ok: retlist.append(exe)
        return list(retlist)
        
    def __check_ao_correctness(self, model, exe, executions, run_condition):
        ok = True
        prev_blocking = self.allvexecsmanager.blocking_relations
        self.allvexecsmanager.blocking_relations = [RBF]
        
        # Checking if the candidate is not a superset
        assertions = self.alloy_encoder.print_assert_neg_execs(executions, self.allvexecsmanager.blocking_relations)
        assertion = "\n%s\n"%("\n".join(assertions))
        vmodel = model+assertion
        vmodel += self.alloy_encoder.assert_relation(exe.get_AO())+"\n"
        vmodel += run_condition

        ret = self.alloy_solver.solve_allsmt(vmodel, self.allvexecsmanager, 1)
        if ret != []:
            ok = False

        # Checking if the candidate matches all executions
        assertions = self.alloy_encoder.print_assert_pos_execs(executions, self.allvexecsmanager.blocking_relations)
        if ok and (len(assertions) > 1):
            for assertion in assertions:
                vmodel = "%s\n%s\n"%(model, assertion)
                vmodel += self.alloy_encoder.assert_relation(exe.get_AO())+"\n"
                vmodel += run_condition
                ret = self.alloy_solver.solve_allsmt(vmodel, self.allvexecsmanager, 1)
                if ret == []:
                    ok = False
                    break

        self.allvexecsmanager.blocking_relations = prev_blocking
                
        return ok
    

class EquivalentExecutionSynthetizerCVC4(object):

    c4vexecsmanager = None
    c4_solver = None
    c4_encoder = None

    def __init__(self):
        self.c4vexecsmanager = CVC4SynthProgsModelsManager()
        self.c4_solver = CVC4Solver()
        self.c4_encoder = CVC4Encoder()

    def set_models_file(self, models_file):
        self.c4vexecsmanager.models_file = models_file

    def __check_all_mt(self, model, ao_execs, executions, num_t):
        num_t = min(len(ao_execs), num_t)
        size = int(math.ceil(len(ao_execs)/float(num_t)))
        ao_execs = [ao_execs[x:x+size] for x in xrange(0, len(ao_execs), size)]
        num_t = len(ao_execs)
        retlist = []
        threads = []
        
        with Manager() as manager:
            proclist = []
            for i in range(num_t):
                ret = manager.list([])
                proclist.append(ret)
                process = Process(target=self.__check_all, args=(model, ao_execs[i], executions, ret))
                threads.append(process)
                process.start()

            for thread in threads:
                thread.join()

            for x in proclist:
                retlist += list(x)

        return list(retlist)
        
    def __check_all(self, model, ao_execs, executions, retlist=None):
        if retlist is None: retlist = []
        for exe in ao_execs:
            ok = self.__check_ao_correctness(model, exe, executions)
            if ok: retlist.append(exe)
        return list(retlist)
        
    def __check_ao_correctness(self, model, exe, executions):
        ok = True
        exe = str(exe.get_AO())
        prev_blocking = self.c4vexecsmanager.blocking_relations
        self.c4vexecsmanager.blocking_relations = [RBF]
        
        # Checking if the candidate is not a superset
        assertions = self.c4_encoder.print_assert_neg_execs(executions, self.c4vexecsmanager.blocking_relations)
        assertion = "\n%s\n"%("\n".join(assertions))
        vmodel = model+assertion
        vmodel += self.c4_encoder.assert_formula_nl("%s"%(exe))
        
        ret = self.c4_solver.solve_allsmt(vmodel, self.c4vexecsmanager, 1)
        if ret != []:
            ok = False

        # Checking if the candidate matches all executions
        assertions = self.c4_encoder.print_assert_pos_execs(executions, self.c4vexecsmanager.blocking_relations)
        if ok and (len(assertions) > 1):
            for assertion in assertions:
                vmodel = "%s\n%s\n"%(model, assertion)
                vmodel += self.c4_encoder.assert_formula_nl("%s"%(exe))
                ret = self.c4_solver.solve_allsmt(vmodel, self.c4vexecsmanager, 1)
                if ret == []:
                    ok = False
                    break

        self.c4vexecsmanager.blocking_relations = prev_blocking
                
        return ok
    
    def solve_all_synth(self, model, program, threads):
        timer = Logger.start_timer("CVC4 intersect")
        (ao_execs, executions) = self.find_all_intersect(model, program, threads)
        Logger.stop_timer(timer)
        timer = Logger.start_timer("CVC4 prune equivalent")
        ret = self.prune_not_eq(ao_execs, executions, model, program, threads)
        Logger.stop_timer(timer)
        return ret

    def find_all_intersect(self, model, program, threads):
        self.c4vexecsmanager.program = program
        executions = Executions()
        executions.executions = self.c4vexecsmanager.load_models()
        self.c4vexecsmanager.preload = False        

        vmodel = model+"\n"+self.c4_encoder.print_general_AO(program)
        qupre = QuantPreprocessor()
        qupre.set_expand_sets(True)
        vmodel = qupre.preprocess_from_string(vmodel)
        self.c4vexecsmanager.blocking_relations = [AO]
        ao_execs = []
        for models_blocking in [[RBF]]:
            assertions = self.c4_encoder.print_assert_exl_execs(executions, models_blocking)
            vmodel += "\n%s\n"%assertions
            execs = self.c4_solver.solve_allsmt(vmodel, self.c4vexecsmanager, -1, threads if ao_execs == [] else 1)
            ao_execs += [x for x in execs if x not in ao_execs]
            self.c4vexecsmanager.prevmodels = ao_execs
            Logger.msg(" ", 0)
        self.c4vexecsmanager.prevmodels = None

        Logger.log(" -> Found %s possible candidates"%(len(ao_execs)), 1)
        Logger.msg("Checking correctness... ", 1)

        if Logger.level(1):
            Logger.msg("\n", -1)
            for el in ao_execs:
                Logger.log("INTERSECTING: %s"%el.get_AO(), 1)

        return (ao_execs, executions)

    def prune_not_eq(self, ao_execs, executions, model, program, threads):
        self.c4vexecsmanager.preload = False        
        beparser = BeParser()
        eq_progs = []
        equivalent_AOs = []
        events_dic = dict([(x.name, x) for x in program.get_events()])

        if threads > 1:
            valid_aos = self.__check_all_mt(model, ao_execs, executions, threads)
        else:
            valid_aos = self.__check_all(model, ao_execs, executions)
        
        for exe in valid_aos:
            rel = Relation(AO)
            rel.tuples = [(events_dic[str(x[0])], events_dic[str(x[1])]) for x in exe.get_AO().tuples]
            exe.set_AO(rel)
            exe.program = program
            equivalent_AOs.append(exe)
            program = beparser.program_from_execution(exe)
            eq_progs.append(program)

        Logger.log(" DONE", 1)
        if Logger.level(1):
            for el in equivalent_AOs:
                Logger.log("EQUIVALENT: %s"%el.get_AO(), 1)

        return eq_progs
    
class CVC4ConstraintAnalyzerManager(ModelsManager):

    encoder = None
    labelling_vars = None
    
    def __init(self):
        self.encoder = CVC4Encoder()
    
    def compute_from_smt(self, smt):
        assigns = self.exprmgr.mkBoolConst(True)
        model = []
        for varstr in self.labelling_vars:
            assign = self.symboltable.lookup(varstr)
            value = smt.getValue(assign)
            model.append("%s%s"%("" if value.getConstBoolean() else "~", assign.toString()))
            
            assign = self.exprmgr.mkExpr(EQUAL, assign, smt.getValue(assign))
            assigns = self.exprmgr.mkExpr(AND, assigns, assign)

        blocking = self.exprmgr.mkExpr(NOT, assigns)
        Logger.log("Blocking: %s"%(blocking.toString()), 2)
        return ([blocking], "(%s)"%" & ".join(model))

    def compute_from_sharedobjs(self, shared_objs):
        return ""

    def write_models(self, shared_objs, done):
        pass

    def load_models(self):
        return []
    
    def solutions_separators(self):
        pass

class AlloyConstraintAnalyzerManager(ModelsManager):

    encoder = None
    labelling_vars = None
    id_blocking = 0
    
    def __init(self):
        self.encoder = AlloyEncoder()
    
    def compute_from_smt(self, model):
        AlloyConstraintAnalyzerManager.id_blocking += 1

        blocking = []
        bddmodel = []
        for var in self.labelling_vars:
            value = self.__get_condition(model, var)
            if value is not None:
                blocking.append("(%s.value = %s)"%(var, value))
                bddmodel.append("(%s%s)"%("~" if value == "TRUE" else "", var))
            
        blocking_str = "fact block_smt_%s {not (%s)}\n"%(AlloyConstraintAnalyzerManager.id_blocking, " and ".join(blocking))
        Logger.log("Blocking: %s"%(blocking_str), 2)
        return (blocking_str, (" and ".join(blocking), " & ".join(bddmodel)))

    def __get_condition(self, model, condition):
        for el in model:
            if ("this/%s<:value="%condition in el):
                return str("TRUE" in el).upper()
        return None
    
    def compute_from_sharedobjs(self, shared_objs):

        ret = []
        idx = 0
        for el in shared_objs:
            idx += 1
            ret.append("fact block_smt_%s {not (%s)}\n"%(idx, el[0]))

        return "\n".join(ret)

    def write_models(self, shared_objs, done):
        pass

    def load_models(self):
        return []
    
    def solutions_separators(self):
        pass
    
    
class ConstraintsAnalyzer(object):

    c4_solver = None
    c4_encoder = None

    al_solver = None
    al_encoder = None
    
    bsolver = None

    def set_models_file(self, models_file):
        self.c4_consamanager.models_file = models_file
        self.al_consamanager.models_file = models_file
    
    def __init__(self):
        self.c4_solver = CVC4Solver()
        self.c4_encoder = CVC4Encoder()

        self.al_solver = AlloySolver()
        self.al_encoder = AlloyEncoder()
        
        self.bsolver = BDDSolver()
        self.c4_consamanager = CVC4ConstraintAnalyzerManager()
        self.al_consamanager = AlloyConstraintAnalyzerManager()

    def analyze_constraints_cvc4(self, program, model, jsengine, runs, threads, jsprogram):
        return self.analyze_constraints(program, model, jsengine, runs, threads, jsprogram, False)

    def analyze_constraints_alloy(self, program, model, jsengine, runs, threads, jsprogram):
        return self.analyze_constraints(program, model, jsengine, runs, threads, jsprogram, True)
        
    def analyze_constraints(self, program, model, jsengine, runs, threads, jsprogram, use_alloy):
        matched = []
        unmatched = []

        config = Config()
        config.command = jsengine
        config.input_file = jsprogram
        config.threads = threads
        config.number = runs
        config.silent = True
        config.models = True

        if use_alloy:
            labelling_vars = [y[2] for y in [x.split(" ") for x in model.split("\n") if len(x.split(" "))>2] \
                              if y[2][:len(LABELLING_VAR_PREF)] == LABELLING_VAR_PREF]
        else:
            labelling_vars = [x.split(" ")[0] for x in model.split("\n") \
                              if x[:len(LABELLING_VAR_PREF)] == LABELLING_VAR_PREF]
        
        if len(labelling_vars) == 0:
            Logger.error("No labelling vars defined")
            return None

        if use_alloy:
            self.al_consamanager.labelling_vars = labelling_vars
        else:
            self.c4_consamanager.labelling_vars = labelling_vars
            
        (matched, unmatched) = run_litmus(config)

        parser = BeParser()
        mexecs = parser.executions_from_string("\n".join(matched), program)
        uexecs = parser.executions_from_string("\n".join(unmatched), program)
        
        Logger.log(" -> Found %s matched models"%(len(matched)), 0)
        Logger.log(" -> Found %s unmatched models"%(len(unmatched)), 0)

        if len(unmatched) == 0:
            Logger.error("No unmatched models")
            return None

        rels = [x for x in RELATIONS if x != AO]
        
        matched = self.al_encoder.print_assert_exl_execs(mexecs, rels) if use_alloy else \
                  self.c4_encoder.print_assert_exl_execs(mexecs, rels)
        unmatched = self.al_encoder.print_assert_exl_execs(uexecs, rels) if use_alloy else \
                    self.c4_encoder.print_assert_exl_execs(uexecs, rels)
            
        objs = []
        Logger.log("\nMatched models analysis", 0)
        Logger.msg("Solving... ", 0)
        
        if use_alloy:
            vmodel = "\n".join([model, matched, self.al_encoder.print_run_condition(program, True)])
            objs = self.al_solver.compute_models(vmodel, self.al_consamanager, objs)
            mmodels = " | ".join([x[1] for x in objs])
        else:
            vmodel = "%s\n%s"%(model, matched)
            objs = self.c4_solver.compute_models(vmodel, self.c4_consamanager, objs)
            mmodels = " | ".join(objs)
            
        Logger.log(" DONE", 0)
        mmodels = self.bsolver.simplify(mmodels, True)
        Logger.log(" -> Found %s labelling solutions\n%s\n"%(len(mmodels), " | \n".join(mmodels)), 0)

        objs = []
        Logger.log("Unmatched models analysis", 0)
        Logger.msg("Solving... ", 0)
        
        if use_alloy:
            vmodel = "\n".join([model, unmatched, self.al_encoder.print_run_condition(program, True)])
            objs = self.al_solver.compute_models(vmodel, self.al_consamanager, objs)
            nmodels = " | ".join([x[1] for x in objs])
        else:
            vmodel = "%s\n%s"%(model, unmatched)
            objs = self.c4_solver.compute_models(vmodel, self.c4_consamanager, objs)
            nmodels = " | ".join(objs)
            
        Logger.log(" DONE", 0)
        nmodels = self.bsolver.simplify(nmodels, True)
        Logger.log(" -> Found %s labelling solutions\n%s\n"%(len(nmodels), " | \n".join(nmodels)), 0)

        Logger.log("Difference analysis (exist support(matched) in unmatched)", 0)
        diffmodels = self.bsolver.support_exist(" | ".join(mmodels), " | ".join(nmodels), True)
        Logger.log(" -> Found %s labelling solutions\n%s"%(len(diffmodels), " | \n".join(diffmodels)), 0)

        self.user_defined_analyses(mmodels, nmodels)
        
        return (mmodels, nmodels, diffmodels)
    
    def user_defined_analyses(self, mmodels, nmodels):
        config = configparser.ConfigParser()
        config.optionxform=str
        
        with open(UNMATCHED_FILE, "r") as f:
            config.read_string(u""+f.read())

        analyses = []
            
        for value in config:
            if value == DEFAULT: continue
            analysis = config[value]
            analyses.append((analysis[DESCRIPTION], analysis[FORMULA]))

        for analysis in analyses:
            Logger.log("\n"+analysis[0], 0)
            formula = analysis[1].replace("unmatched", "{u}").replace("matched", "{m}").replace("!","~")
            formula = formula.format(m=" | ".join(mmodels), u=" | ".join(nmodels))
            formula = self.bsolver.simplify(formula, True)
            Logger.log(" -> Found %s labelling solutions\n%s"%(len(formula), " | \n".join(formula)), 0)
