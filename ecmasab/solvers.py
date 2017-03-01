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

from ecmasab.execution import Execution, \
    Relation, \
    Memory_Event, \
    RELATIONS, \
    BLOCKING_RELATIONS
from ecmasab.beparsing import BeParser
from ecmasab.printers import CVC4Printer
from ecmasab.exceptions import UnreachableCodeException

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
    assertions = None
    incremental = None
    
    def __init__(self):
        self.verbosity = 1
        self.models_file = None
        self.executions = []
        self.assertions = []
        self.incremental = False

    def __add_execution(self, execution):
        if str(execution) in self.executions:
            raise UnreachableCodeException("Enumeration of not distincs models")
        
        self.executions.append(str(execution))
    
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

        return Memory_Event(name, operation, tear, ordering, address, block, values)

    def __get_all_tuples(self, expression, tuples):
        if expression.isNull():
            return

        if expression.getType().isTuple():
            tuples.append(expression)
        else:
            for child in expression.getChildren():
                self.__get_all_tuples(child, tuples)

        return tuples

    def solve_all(self, model):
        return self.__solve_k(model, -1)

    def solve_n(self, model, num):
        return self.__solve_k(model, num)
    
    def __solve_k(self, model, n):

        if self.incremental:
            return self.__solve(model, n)[0]

        sol = 0
        while (sol < n) or (n == -1):
            (sol, ret) = self.__solve(model, 1)
            if ret == 0:
                break
        return sol
        
    def __load_models(self):
        c4printer = CVC4Printer()
        parser = BeParser()
        if self.models_file:
            if os.path.exists(self.models_file):
                with open(self.models_file, "r") as f:
                    executions = parser.executions_from_string(f.read())
                    self.assertions = c4printer.print_assertions(executions)

    def get_models_size(self):
        self.__load_models()
        return len(self.assertions)
    
    def __solve(self, model, num):
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

        self.__load_models()
                
        pre_ind = len(self.assertions)
        model += "\n"+("\n".join(self.assertions))

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
                return [ind+pre_ind, 0]

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

            self.__add_execution(exe)
            
            if self.verbosity > 0:
                sys.stdout.write(".")
                sys.stdout.flush()
            if self.verbosity > 1:
                print("%s: %s"%(ind+pre_ind+1, c4printer.print_execution(exe)))

            if self.models_file:
                with open(self.models_file, "a") as f:
                    f.write("%s\n"%c4printer.print_execution(exe))

            blocking = exprmgr.mkExpr(CVC4.NOT, assigns)

            assertion = AssertCommand(blocking)
            assertion.invoke(smt)
            ind +=1

            if (num != -1) and (ind >= num):
                return [ind+pre_ind, 1]
            
        return [-1, -1]
