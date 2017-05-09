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
import sys
import re
from six.moves import range
import os
import random
from multiprocessing import Process, Manager


from ecmasab.execution import Execution, \
    Relation, \
    Memory_Event, \
    Executions, \
    RELATIONS, \
    BLOCKING_RELATIONS
from ecmasab.beparsing import BeParser
from ecmasab.printers import CVC4Printer

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

    def __init__(self):
        self.verbosity = 1
        self.models_file = None
        self.executions = Executions()
        self.variables = []
        self.incremental = False
        self.shuffle_constraints = False

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
            if (self.verbosity > 0):
                sys.stdout.write(" ")
                sys.stdout.flush()
            return ret.get_size()
        ret = self.__load_and_solve_n(model, -1)
        return ret.get_size()

    def solve_one(self, model):
        ret = self.__load_and_solve_n(model, 1)
        return ret.get_size()
    
    def __load_and_solve_n(self, model, n):

        self.__load_models()
        sol = self.__solve_n(model, n, None)
        self.__write_models()
                
        return sol


    def __load_and_solve_mt(self, model, program, num_t):
        self.__load_models()

        revents = [x for x in program.get_events() if x.is_read_or_modify()]
        wevents = [x for x in program.get_events() if x.is_write_or_modify()]
        
        rb_set = list(set([(x,y) for y in wevents for x in revents]))
        if len(revents) > 1:
            rb_cons = ["ASSERT ((%s, %s) IS_IN RF) AND ((%s, %s) IS_IN RF)"%(x[0], x[1], y[0], y[1]) for x in rb_set for y in rb_set if x[0] != y[0]]
        else:
            rb_cons = ["ASSERT ((%s, %s) IS_IN RF)"%(x[0], x[1]) for x in rb_set]

        if self.shuffle_constraints:
            random.shuffle(rb_cons)
        num_t = min(len(rb_cons), num_t)

        with Manager() as manager:
            shared_execs = manager.list([])
            rb_cons = manager.list(rb_cons)

            threads = []
            for i in range(num_t-1):
                process = Process(target=self.__solve_n, args=(model, -1, i, rb_cons, shared_execs))
                threads.append(process)
                process.start()

            allexecs = Process(target=self.__solve_n, args=(model, -1, None, None, shared_execs))
            allexecs.start()                            
            allexecs.join()

            for thread in threads:
                thread.terminate()

            for el in shared_execs:
                if el not in self.executions.executions:
                    self.executions.add_execution(el)
        
        self.__write_models()
                
        return self.executions

    def __solve_n(self, model, n, id_thread=None, constraints=None, shared_execs=None):
        applying_cons = None

        is_multithread = shared_execs is not None
        is_master = constraints is None
        
        if constraints is not None:
            applying_cons = constraints[id_thread]
            
        if self.incremental:
            return self.__compute_models(model, n, applying_cons, shared_execs)[0]
            
        sol = None
        prvsolsize = 0
        solsize = 0
        while (sol < n) or (n == -1):
            (sol, ret) = self.__compute_models(model, 1, applying_cons, shared_execs)
            if (self.verbosity > 0) and (is_multithread):
                solsize = len(shared_execs)
                if (solsize > (prvsolsize+1)) and (is_master):
                    gain = solsize-prvsolsize-1
                    sys.stdout.write("+%s%s"%(gain, "."*(gain)))
                    sys.stdout.flush()
                prvsolsize = solsize
            if (ret == 0) and (not is_master):
                if id_thread >= len(constraints)-1:
                    break
                if (self.verbosity > 0):
                    sys.stdout.write("d")
                    sys.stdout.flush()
                constraints[id_thread] = constraints[-1]
                del(constraints[-1])
                if self.shuffle_constraints:
                    random.shuffle(constraints)                
                applying_cons = constraints[id_thread]
                continue
            if ret == 0:
                break

        return sol
    
    def __write_models(self):
        if self.models_file:
            c4printer = CVC4Printer()
            with open(self.models_file, "w") as f:
                for exe in self.executions.executions:
                    f.write("%s\n"%c4printer.print_execution(exe))
                f.write("%s\n"%c4printer.print_done())
        
    def __load_models(self):
        parser = BeParser()
        if self.models_file:
            if os.path.exists(self.models_file):
                with open(self.models_file, "r") as f:
                    self.executions = parser.executions_from_string(f.read())
                    
    def get_models_size(self):
        self.__load_models()
        return self.executions.get_size()

    def is_done(self):
        executions = self.__load_models()
        if not executions:
            return False
        return executions.allexecs

    def __compute_models(self, model, num, constraints=None, shared_execs=None):
        opts = Options()
        opts.setInputLanguage(CVC4.INPUT_LANG_CVC4)

        exit_with_unknown = False
        
        exprmgr = ExprManager(opts)

        smt = SmtEngine(exprmgr)
        smt.setOption("produce-models", SExpr(True))
        smt.setOption("fmf-bound", SExpr(True))
        smt.setOption("macros-quant", SExpr(True))
        smt.setOption("finite-model-find", SExpr(True))
#        smt.setOption("repeat-simp", SExpr(True))
#        smt.setOption("check-models", SExpr(True))
#        smt.setOption("full-saturate-quant", SExpr(True))
#        smt.setOption("incremental", SExpr(True))

        ind = 0
        pre_ind = 0
        c4printer = CVC4Printer()

        if shared_execs is not None:
            for el in shared_execs:
                self.executions.add_execution(el)
        
        assertions = c4printer.print_assertions(self.executions)
            
        pre_ind = len(assertions)
        model += "\n"+("\n".join(assertions))

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

            if self.verbosity > 1:
                print("sat: %s, uns: %s, unk: %s"%(sat, uns, unk))
            
            exitcond = (not sat) if exit_with_unknown else uns
            
            if exitcond:
                return (self.executions, 0)

            assigns = exprmgr.mkBoolConst(True)

            exe = Execution()
            for relation in RELATIONS:
                assign = symboltable.lookup(relation)
                value = smt.getValue(assign)
                rel = self.__relation_from_formula(relation, value)

                exe.set_relation_by_name(relation, rel)

                if relation in BLOCKING_RELATIONS:
                    assign = exprmgr.mkExpr(CVC4.EQUAL, assign, smt.getValue(assign))
                    assigns = exprmgr.mkExpr(CVC4.AND, assigns, assign)

            for variable in self.variables:
                assign = symboltable.lookup(variable)
                value = smt.getValue(assign).toString()
                exe.add_condition(variable, value)

                assign = exprmgr.mkExpr(CVC4.EQUAL, assign, smt.getValue(assign))
                assigns = exprmgr.mkExpr(CVC4.AND, assigns, assign)

            self.executions.add_execution(exe)

            if shared_execs is not None:
                if exe not in shared_execs:
                    shared_execs.append(exe)
            
            if (self.verbosity > 0) and (constraints is None):
                sys.stdout.write(".")
                sys.stdout.flush()
            if self.verbosity > 1:
                print("%s: %s"%(ind+pre_ind+1, c4printer.print_execution(exe)))

            blocking = exprmgr.mkExpr(CVC4.NOT, assigns)

            assertion = AssertCommand(blocking)
            assertion.invoke(smt)
            ind +=1

            if (num != -1) and (ind >= num):
                return (self.executions, 1)
            
        return (None, -1)
