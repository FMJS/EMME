# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import CVC4
import re
from six.moves import range
import os
import random
from multiprocessing import Process, Manager
from ecmasab.preprocess import QuantPreprocessor

from ecmasab.execution import Execution, \
    Relation, \
    Memory_Event, \
    Executions, \
    RELATIONS, \
    AO, RF
from ecmasab.parsing import BeParser
from ecmasab.encoders import CVC4Encoder

from ecmasab.logger import Logger

from CVC4 import Options, \
    ExprManager, \
    ParserBuilder, \
    SmtEngine, \
    SExpr, \
    CheckSatCommand, \
    AssertCommand

class CVC4Solver(object):
    verbosity = None
    models_file = None

    executions = None
    incremental = None
    variables = None

    shuffle_constraints = None

    relations = RELATIONS

    encoder = None

    def __init__(self):
        self.verbosity = 1
        self.models_file = None
        self.executions = Executions()
        self.variables = []
        self.incremental = False
        self.shuffle_constraints = False
        self.encoder = CVC4Encoder()

    def set_additional_variables(self, variables):
        self.variables = variables
        
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

    def solve_all(self, model, program=None, threads=1):
        if threads > 1:
            ret = self.__load_and_solve_mt(model, program, threads)
            Logger.msg(" ", 0)
            return ret.get_size()
        ret = self.__load_and_solve_n(model, -1)
        return len(ret)

    def solve_one(self, model):
        ret = self.__load_and_solve_n(model, 1)
        return len(ret)

    def __check_ao_correctness(self, model, exe):
        exe = str(exe.get_AO())
        ok = True

        prev_blocking = Executions.get_blocking_relations()
        Executions.set_blocking_relations([RF])
        
        assertions = self.encoder.print_neg_assertions(self.executions)
        
        # Checking if the candidate is not a superset
        assertion = "\n"+("\n".join(assertions))
        vmodel = model+assertion
        vmodel += "\nASSERT (%s);\n"%(exe.replace("{}", "empty_rel_set"))
        ret = self.__compute_models(vmodel, 1, self.__compute_blocking_relation, None, None)[1]
        if ret != 0:
            ok = False

        # Checking if the candidate mathces all executions
        if ok and (len(assertions) > 1):
            for assertion in assertions:
                vmodel = model+"\n"+assertion+"\n"
                vmodel += "\nASSERT (%s);\n"%(exe)
                (sol, ret) = self.__compute_models(vmodel, 1, self.__compute_blocking_relation, None, None)
                if ret == 0:
                    ok = False
                    break

        Executions.set_blocking_relations(prev_blocking)
                
        return ok
    
    def solve_all_synth(self, model, program=None):
        self.__load_models()
        assertions = self.encoder.print_ex_assertions(self.executions)
        vmodel = model+"\n"+assertions+"\n"

        vmodel += self.encoder.print_general_AO(program)

        qupre = QuantPreprocessor()
        qupre.set_expand_sets(True)
        vmodel = qupre.preprocess_from_string(vmodel)

        prev_executions = self.executions
        self.executions = Executions()
        Executions.set_blocking_relations([AO])
        self.__solve_n(vmodel, -1, self.executions.executions)
        ao_execs = self.executions
        self.executions = prev_executions

        Logger.msg(" ", 0)
        Logger.log(" -> Found %s possible candidates"%(ao_execs.get_size()), 1)
        
        equivalent_AOs = []

        Logger.msg("Checking correctness... ", 1)

        beparser = BeParser()

        eq_progs = []
        events_dic = dict([(x.name, x) for x in program.get_events()])
        
        for exe in ao_execs.executions:
            rel = Relation(AO)
            rel.tuples = [(events_dic[x[0]], events_dic[x[1]]) for x in exe.get_AO().tuples]
            exe.set_AO(rel)
            exe.program = program
            ok = self.__check_ao_correctness(model, exe)
            if ok:
                equivalent_AOs.append(exe)
                program = beparser.program_from_execution(exe)
                eq_progs.append(program)

        Logger.log("DONE", 1)
        for el in equivalent_AOs:
            Logger.log("OK: %s"%el.get_AO(), 1)

        return eq_progs
    
    def __load_and_solve_n(self, model, n):

        self.__load_models()
        sol = self.__solve_n(model, n, self.executions.executions)
                
        return sol


    def __load_and_solve_mt(self, model, program, num_t):
        self.__load_models()

        rb_set = self.encoder.get_compatible_reads(program)[0]
        rb_cons = ["ASSERT (%s IS_IN RF)"%(x) for x in rb_set]

        Logger.msg("(%s)"%len(rb_cons), 0)
        
        if self.shuffle_constraints:
            random.shuffle(rb_cons)
        num_t = min(len(rb_cons), num_t)

        with Manager() as manager:
            shared_execs = manager.list([])
            rb_cons = manager.list(rb_cons)

            threads = []
            for i in range(num_t-1):
                process = Process(target=self.__solve_n, args=(model, -1, shared_execs, i, num_t-1, rb_cons))
                threads.append(process)
                process.start()

            allexecs = Process(target=self.__solve_n, args=(model, -1, shared_execs, 0))
            allexecs.start()                            
            allexecs.join()

            for thread in threads:
                thread.terminate()

            for el in shared_execs:
                if el not in self.executions.executions:
                    self.executions.add_execution(el)
                
        return self.executions

    def __solve_n(self, model, n, shared_execs=None, id_thread=None, total=None, constraints=None):
        applying_cons = None

        is_multithread = id_thread is not None
        is_master = constraints is None

        if constraints is not None:
            applying_cons = constraints[id_thread]
            
        if self.incremental:
            assertions = "\n"+("\n".join(self.encoder.print_neg_assertions(self.executions)))
            vmodel = model + assertions

            (sol, ret) = self.__compute_models(model, n, self.__compute_blocking_relation, applying_cons, shared_execs)

            for el in sol:
                self.executions.add_execution(el)
            
            self.__write_models(ret == 0)
            
            return sol
            
        sol = None
        prvsolsize = 0
        solsize = 0
        while (solsize < n) or (n == -1):
            prvsolsize = solsize

            if shared_execs is not None:
                for el in shared_execs:
                    self.executions.add_execution(el)
        
            assertions = "\n"+("\n".join(self.encoder.print_neg_assertions(self.executions)))
            vmodel = model + assertions

            (sol, ret) = self.__compute_models(vmodel, 1, self.__compute_blocking_relation, applying_cons, shared_execs)

            for el in sol:
                self.executions.add_execution(el)
            
            solsize = self.executions.get_size() if sol is not None else 0
            
            if is_master:
                self.__write_models(ret == 0)
            
            if (self.verbosity > 0) and is_multithread and is_master:
                if ((solsize - prvsolsize) > 1):
                    gain = (solsize-prvsolsize)-1
                    Logger.msg("+%s%s"%(gain, "."*(gain)), 0)

            if not is_master:
                if ret == 0: #UNSAT
                    if id_thread >= len(constraints)-1:
                        break
                    Logger.msg("d", 0)
                    constraints[id_thread] = constraints[-1]
                    del(constraints[-1])
                    applying_cons = constraints[id_thread]
                    continue

                if ret == 2: # Not interesting constraint
                    Logger.msg("s", 0)

                    if len(constraints) > total:
                        tmp = constraints[id_thread]
                        constraints[id_thread] = constraints[-1]
                        constraints[-1] = tmp
                        constraints[total:] = constraints[total+1:] + [constraints[total]]
                        applying_cons = constraints[id_thread]
            
            if ret == 0:
                break

        return sol
    
    def __write_models(self, done):
        if self.models_file:
            with open(self.models_file, "w") as f:
                for exe in self.executions.executions:
                    f.write("%s\n"%self.encoder.print_execution(exe))
                if done:
                    f.write("%s\n"%self.encoder.print_done())
        
    def __load_models(self):
        parser = BeParser()
        if self.models_file:
            if os.path.exists(self.models_file):
                with open(self.models_file, "r") as f:
                    self.executions = parser.executions_from_string(f.read())
        return self.executions
                    
    def get_models_size(self):
        self.__load_models()
        return self.executions.get_size()

    def is_done(self):
        executions = self.__load_models()
        if not executions:
            return False
        return executions.allexecs

    def __compute_models(self, model, num, compute_blocking_clauses, constraints=None, shared_objects=None):
        opts = Options()
        opts.setInputLanguage(CVC4.INPUT_LANG_CVC4)

        exit_with_unknown = False

        if shared_objects is None:
            shared_objects = []
        
        exprmgr = ExprManager(opts)

        smt = SmtEngine(exprmgr)
        smt.setOption("produce-models", SExpr(True))
        smt.setOption("fmf-bound", SExpr(True))
        smt.setOption("macros-quant", SExpr(True))
        smt.setOption("finite-model-find", SExpr(True))
#        smt.setOption("repeat-simp", SExpr(True))
#        smt.setOption("check-models", SExpr(True))
#        smt.setOption("full-saturate-quant", SExpr(True))
        smt.setOption("incremental", SExpr(True))

        ind = 0

        if constraints:
            model += "\n%s;"%(constraints)

        parserbuilder = ParserBuilder(exprmgr, "", opts)
        parserbuilder.withStringInput(model)
        parser = parserbuilder.build()

        symboltable = parser.getSymbolTable()

        while True:
            cmd = parser.nextCommand()
            if not cmd: break
            cmd.invoke(smt)

        while True:
            checksat = CheckSatCommand()
            checksat.invoke(smt)

            sat = checksat.getResult().isSat() == 1
            unk = checksat.getResult().isUnknown()
            uns = (not sat) and (not unk)

            Logger.log("sat: %s, uns: %s, unk: %s"%(sat, uns, unk), 1)
            
            exitcond = (not sat) if exit_with_unknown else uns
            
            if exitcond:
                return (shared_objects, 0)

            (bclauses, shared_obj) = compute_blocking_clauses(exprmgr, symboltable, smt)

            Logger.log("%s"%str(shared_obj), 1)
            
            if shared_obj not in shared_objects:
                shared_objects.append(shared_obj)
            else:
                if constraints is not None:
                    return (shared_objects, 2)

            Logger.msg(".", 0, constraints is None)

            for bclause in bclauses:
                assertion = AssertCommand(bclause)
                assertion.invoke(smt)
                
            ind +=1
            if (num != -1) and (ind >= num):
                return (shared_objects, 1)
            
        return (None, -1)

    def __compute_blocking_relation(self, exprmgr, symboltable, smt):
        assigns = exprmgr.mkBoolConst(True)
        exe = Execution()

        rels = exprmgr.mkBoolConst(True)
        
        for relation in self.relations:
            assign = symboltable.lookup(relation)
            value = smt.getValue(assign)
            rel = self.__relation_from_formula(relation, value)
            assert(rel is not None)

            exe.set_relation_by_name(relation, rel)

            if relation in Executions.get_blocking_relations():
                assign = exprmgr.mkExpr(CVC4.EQUAL, assign, smt.getValue(assign))
                assigns = exprmgr.mkExpr(CVC4.AND, assigns, assign)

            if relation in ["HB", "MO", "SW"]:
                rel = exprmgr.mkExpr(CVC4.EQUAL, assign, smt.getValue(assign))
                rels = exprmgr.mkExpr(CVC4.AND, rels, rel)
                
        for variable in self.variables:
            assign = symboltable.lookup(variable)
            value = smt.getValue(assign).toString()
            exe.add_condition(variable, value)

            assign = exprmgr.mkExpr(CVC4.EQUAL, assign, smt.getValue(assign))
            assigns = exprmgr.mkExpr(CVC4.AND, assigns, assign)

        blocking = exprmgr.mkExpr(CVC4.NOT, assigns)

        Logger.log("Blocking: %s"%(blocking.toString()), 1)
        
        return ([blocking], exe)
