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
import os
from six.moves import range
from multiprocessing import Process, Manager
from ecmasab.logger import Logger
import subprocess

from CVC4 import Options, \
    ExprManager, \
    ParserBuilder, \
    SmtEngine, \
    SExpr, \
    CheckSatCommand, \
    AssertCommand, \
    Input_newStreamInput

from dd.autoref import BDD

class ModelsManager(object):

    exprmgr = None
    symboltable = None
    models_file = None
    
    def __init__(self):
        self.exprmgr = None
        self.symboltable = None
        self.models_file = None
    
    def compute_from_smt(self, smt):
        pass

    def compute_from_sharedobjs(self, shared_objs):
        pass

    def write_models(self, shared_objs, done):
        pass

    def load_models(self):
        pass
    
    def solutions_separators(self):
        pass
    
class CVC4Solver(object):
    verbosity = None
    models_file = None
    incremental = None

    def __init__(self):
        self.verbosity = 1
        self.models_file = None
        self.incremental = True
    
    def solve_allsmt(self, model, blocking_manager, num_sols=-1, num_t=1):
        pre_objs = blocking_manager.load_models()
        ret = []
        if num_t > 1:
            rb_cons = blocking_manager.solutions_separators()
            num_t = min(len(rb_cons), num_t)

            if num_t < 3:
                # Multithread is not necessary
                return self.__solve_nsat(model, num_sols, blocking_manager, pre_objs)
                
            with Manager() as manager:
                shared_objs = manager.list([])
                for el in pre_objs:
                    shared_objs.append(el)
                rb_cons = manager.list(rb_cons)

                threads = []
                for i in range(num_t-1):
                    process = Process(target=self.__solve_nsat, args=(model, -1, blocking_manager, shared_objs, i, num_t-1, rb_cons))
                    threads.append(process)
                    process.start()

                shared_objs = self.__solve_nsat(model, num_sols, blocking_manager, shared_objs, 0)    

                for thread in threads:
                    thread.terminate()

                return list(shared_objs)
        else:
            return self.__solve_nsat(model, num_sols, blocking_manager, pre_objs)
    
    def compute_models(self, model, blocking_manager, shared_objects=None):
        return self.__solve_nsat(model, -1, blocking_manager, shared_objects)
    
    def __solve_nsat(self, model, n, blocking_manager, shared_objs=None, id_thread=None, total=None, constraints=None):
        applying_cons = None

        if shared_objs is None:
            shared_objs = []
        is_multithread = id_thread is not None
        is_master = constraints is None
        
        if constraints is not None:
            applying_cons = constraints[id_thread]
            
        if self.incremental and not is_multithread:
            (sol, ret) = self.__compute_models(model, n, blocking_manager, applying_cons, shared_objs)

            for el in sol:
                if el not in shared_objs:
                    shared_objs.append(el)

            blocking_manager.write_models(shared_objs, ret == 0)
            return sol
            
        sol = None
        prvsolsize = 0
        solsize = 0
        while (solsize < n) or (n == -1):
            prvsolsize = solsize
            (sol, ret) = self.__compute_models(model, 1, blocking_manager, applying_cons, shared_objs)

            for el in sol:
                if el not in shared_objs:
                    shared_objs.append(el)
            solsize = len(sol)
            
            if is_master:
                blocking_manager.write_models(shared_objs, ret == 0)
            
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

        return shared_objs
                    
    def __compute_models(self, model, num, blocking_manager, constraints=None, shared_objects=None):
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

        assertions = blocking_manager.compute_from_sharedobjs(shared_objects)
        model = model + assertions
        
        if constraints:
            model += "\n%s;"%(constraints)

        parserbuilder = ParserBuilder(exprmgr, "", opts)
        parserbuilder.withStringInput(model)
        parser = parserbuilder.build()

        symboltable = parser.getSymbolTable()

        blocking_manager.exprmgr = exprmgr
        blocking_manager.symboltable = symboltable
        
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

            (bclauses, shared_obj) = blocking_manager.compute_from_smt(smt)

            Logger.log("%s"%str(shared_obj), 1)
            
            if shared_obj not in shared_objects:
                shared_objects.append(shared_obj)
            else:
                if constraints is not None:
                    return (shared_objects, 2)

            for bclause in bclauses:
                assertion = AssertCommand(bclause)
                assertion.invoke(smt)

            Logger.msg(".", 0, constraints is None)

            ind +=1
            if (num != -1) and (ind >= num):
                return (shared_objects, 1)
            
        return (None, -1)

class BDDSolver(object):

    def __init__(self):
        pass
    
    def simplify(self, strformula, lst=False):
        variables = re.sub('[~\&\|\(\)]',' ',strformula)
        variables = re.sub(' +',' ',variables.strip())
        variables = variables.split(" ")
        
        bdd = BDD()
        for var in variables:
            bdd.add_var(var)

        u = bdd.add_expr(strformula)
        dnf = self.__get_dnf(bdd, u)

        conj = []
        for el in dnf:
            if el[0] is True:
                el = el[1:]
                el.reverse()
                conj.append("(%s)"%" & ".join(el))

        if lst:
            return conj
                
        return " | ".join(conj)

    def support_exist(self, expr1, expr2, lst=False):
        variables = re.sub('[~\&\|\(\)]',' ',expr1+expr2)
        variables = re.sub(' +',' ',variables.strip())
        variables = variables.split(" ")
        
        bdd = BDD()
        for var in variables:
            bdd.add_var(var)


        expr1 = bdd.add_expr(expr1)
        expr2 = bdd.add_expr(expr2)
        u = bdd.exist(bdd.support(expr1), expr2)
            
        dnf = self.__get_dnf(bdd, u)

        conj = []
        for el in dnf:
            if el[0] is True:
                el = el[1:]
                el.reverse()
                conj.append("(%s)"%" & ".join(el))

        if lst:
            return conj
                
        return " | ".join(conj)
    
    def __get_dnf(self, bdd, u, paths=None):
        if paths is None:
            paths = [[]]
        if u.node == 1:
            return [[True]]
        if u.node == -1:
            return [[False]]

        i, v, w = bdd.succ(u)

        # invert node
        if u.node < 0:
            v.node,w.node = -v.node, -w.node

        var = bdd.var_at_level(i)
        lp = self.__get_dnf(bdd, v, paths)
        rp = self.__get_dnf(bdd, w, paths)

        for el in lp:
            el.append("~%s"%var)
        for el in rp:
            el.append(var)

        return lp+rp
    
class AlloySolver(object):
    ALLOY_REL = "/ext_tools/run_alloy.sh"
    ALLOY_ABS = "/".join(os.path.abspath(__file__).split("/")[:-2])+ALLOY_REL
    
    verbosity = None
    models_file = None
    alloy_processes = None

    def __init__(self):
        self.verbosity = 1
        self.models_file = None
        self.alloy_processes = None

    def solve_allsmt(self, model, blocking_manager, num_sols=-1, num_t=1):
        self.init_solvers(num_t)
        pre_objs = blocking_manager.load_models()
        ret = None
        if num_t > 1:
            rb_cons = blocking_manager.solutions_separators()
            num_t = min(len(rb_cons), num_t)
            if num_t < 3:
                # Multithread is not necessary
                ret = self.__solve_nsat(model, num_sols, blocking_manager, pre_objs)
            else:
                with Manager() as manager:
                    shared_objs = manager.list([])
                    for el in pre_objs:
                        shared_objs.append(el)
                    rb_cons = manager.list(rb_cons)

                    threads = []
                    for i in range(num_t-1):
                        process = Process(target=self.__solve_nsat, args=(model, -1, blocking_manager, shared_objs, i, num_t-1, rb_cons))
                        threads.append(process)
                        process.start()

                    shared_objs = self.__solve_nsat(model, num_sols, blocking_manager, shared_objs, 0)    

                    for thread in threads:
                        thread.terminate()

                    ret = list(shared_objs)
        else:
            ret = self.__solve_nsat(model, num_sols, blocking_manager, pre_objs)

        self.quit_solvers()
        return ret
        
    def __compute_models(self, model, solver, num, blocking_manager, constraints=None, shared_objects=None):
        if constraints:
            model += "\n"+constraints

        assertions = blocking_manager.compute_from_sharedobjs(shared_objects)
        model += "\n"+assertions

        num_sols = 0
        while True:
            if (num != -1) and (num_sols >= num):
                break
            ret = self.solve_one(model, solver)
            if ret is None:
                return (shared_objects, 0)
            num_sols += 1
            (bclauses, shared_obj) = blocking_manager.compute_from_smt(ret)
            Logger.msg(".", 0)

            if shared_obj not in shared_objects:
                shared_objects.append(shared_obj)
            else:
                if constraints is not None:
                    return (shared_objects, 2)
                
            model += bclauses

        return (shared_objects, 1)

    def init_solvers(self, n):
        self.alloy_processes = []
        command = "%s"%self.ALLOY_ABS
        for x in range(n):
            self.alloy_processes.append(subprocess.Popen(command.split(), stdin=subprocess.PIPE, stdout=subprocess.PIPE, shell=True))

    def quit_solvers(self):
        for solver in self.alloy_processes:
            solver.stdin.write(("quit\n").encode())
            solver.stdin.flush()
        
    def solve_one(self, model, solver):
        solver.stdin.write(('%s\nreset\n'%(model)).encode())
        solver.stdin.flush()
        out = ""
        while True:
            line = solver.stdout.readline().decode()
            out += line
            if line in ["sat\n", "unsat\n"]:
                break
        out = out.split("\n")
        Logger.log("Solver: %s"%out[0], 1)
        if out[-2] == "sat":
            return out
        else:
            return None

    def __solve_nsat(self, model, n, blocking_manager, shared_objs=None, id_thread=None, total=None, constraints=None):
        applying_cons = None

        if shared_objs is None:
            shared_objs = []
        is_multithread = id_thread is not None
        is_master = constraints is None

        if is_multithread:
            if is_master:
                process = self.alloy_processes[0]
            else:
                process = self.alloy_processes[id_thread+1]
        else:
            process = self.alloy_processes[0]
            
        if constraints is not None:
            applying_cons = constraints[id_thread]
            
        if not is_multithread:
            (sol, ret) = self.__compute_models(model, process, n, blocking_manager, applying_cons, shared_objs)

            for el in sol:
                if el not in shared_objs:
                    shared_objs.append(el)

            blocking_manager.write_models(shared_objs, ret == 0)
            return sol
            
        sol = None
        prvsolsize = 0
        solsize = 0
        while (solsize < n) or (n == -1):
            prvsolsize = solsize
            (sol, ret) = self.__compute_models(model, process, 1, blocking_manager, applying_cons, shared_objs)

            for el in sol:
                if el not in shared_objs:
                    shared_objs.append(el)
            solsize = len(sol)
            
            if is_master:
                blocking_manager.write_models(shared_objs, ret == 0)
            
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

        return shared_objs
        
