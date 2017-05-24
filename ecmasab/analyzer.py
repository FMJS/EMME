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
from ecmasab.solvers import CVC4Solver
from ecmasab.logger import Logger

from ecmasab.execution import Execution

from CVC4 import BOOLEAN_TYPE, EQUAL, AND, NOT

from dd.autoref import BDD, Function

LABELLING_VARS = []
LABELLING_VARS.append("L_HB4a")
LABELLING_VARS.append("L_HB4b")
LABELLING_VARS.append("L_HB4c")
LABELLING_VARS.append("L_HB4d")

LABELLING_VARS.append("L_RF_implies_HB")


class ConstraintsAnalyzer(object):

    solver = None
    
    def __init__(self):
        self.solver = CVC4Solver()

    def analyze_constraints(self, matched, unmatched, model):
        matched = []
        unmatched = []

        with open("/tmp/mm.cvc", "r") as f:
            model = f.read()

        matched.append("HB = {(id1_W_main, id2_W_t1), (id1_W_main, id3_W_t1), (id1_W_main, id4_R_t2)} AND MO = {(id2_W_t1, id3_W_t1), (id1_W_main, id2_W_t1), (id1_W_main, id3_W_t1), (id1_W_main, id4_R_t2), (id2_W_t1, id4_R_t2), (id3_W_t1, id4_R_t2)} AND RBF = {((id4_R_t2, id1_W_main), 1), ((id4_R_t2, id1_W_main), 2), ((id4_R_t2, id1_W_main), 3), ((id4_R_t2, id2_W_t1), 0)} AND RF = {(id4_R_t2, id1_W_main), (id4_R_t2, id2_W_t1)} AND SW = empty_rel_set")
        matched.append("HB = {(id2_W_t1, id3_W_t1)} AND MO = {(id2_W_t1, id3_W_t1), (id1_W_main, id2_W_t1), (id1_W_main, id3_W_t1), (id1_W_main, id4_R_t2), (id2_W_t1, id4_R_t2), (id3_W_t1, id4_R_t2)} AND RBF = {((id4_R_t2, id1_W_main), 2), ((id4_R_t2, id1_W_main), 3), ((id4_R_t2, id3_W_t1), 0), ((id4_R_t2, id3_W_t1), 1)} AND RF = {(id4_R_t2, id1_W_main), (id4_R_t2, id3_W_t1)} AND SW = empty_rel_set")
        matched.append("HB = {(id1_W_main, id4_R_t2)} AND MO = {(id2_W_t1, id3_W_t1), (id1_W_main, id2_W_t1), (id1_W_main, id3_W_t1), (id1_W_main, id4_R_t2), (id2_W_t1, id4_R_t2), (id3_W_t1, id4_R_t2)} AND RBF = {((id4_R_t2, id1_W_main), 0), ((id4_R_t2, id1_W_main), 1), ((id4_R_t2, id1_W_main), 2), ((id4_R_t2, id1_W_main), 3)} AND RF = {(id4_R_t2, id1_W_main)} AND SW = {(id1_W_main, id4_R_t2)}")

        unmatched.append("HB = {(id1_W_main, id2_W_t1), (id1_W_main, id3_W_t1), (id1_W_main, id4_R_t2)} AND MO = {(id2_W_t1, id3_W_t1), (id1_W_main, id2_W_t1), (id1_W_main, id3_W_t1), (id1_W_main, id4_R_t2), (id2_W_t1, id4_R_t2), (id3_W_t1, id4_R_t2)} AND RBF = {((id4_R_t2, id1_W_main), 2), ((id4_R_t2, id1_W_main), 3), ((id4_R_t2, id2_W_t1), 0), ((id4_R_t2, id3_W_t1), 1)} AND RF = {(id4_R_t2, id1_W_main), (id4_R_t2, id2_W_t1), (id4_R_t2, id3_W_t1)} AND SW = empty_rel_set")

        vmodel = "%s\nASSERT %s;"%(model, " OR ".join(matched))
        objs = []
        objs = self.solver.compute_models(vmodel, self.__compute_blocking_relation, objs)
        mmodels = " | ".join(objs)
        
        print " | \n".join(self.__bdd_simplification(mmodels, True))
        print ""
        
        vmodel = "%s\nASSERT %s;"%(model, " OR ".join(unmatched))
        objs = []
        objs = self.solver.compute_models(vmodel, self.__compute_blocking_relation, objs)
        nmodels = " | ".join(objs)

        print " | \n".join(self.__bdd_simplification(nmodels, True))
        print ""
        
        print " | \n".join(self.__bdd_simplification("%s & ~(%s)"%(nmodels, mmodels), True))
        
    def __compute_blocking_relation(self, exprmgr, symboltable, smt):
        assigns = exprmgr.mkBoolConst(True)
        
        model = []

        for varstr in LABELLING_VARS:
            assign = symboltable.lookup(varstr)
            value = smt.getValue(assign)
            model.append("%s%s"%("" if value.getConstBoolean() else "~", assign.toString()))
            
            assign = exprmgr.mkExpr(EQUAL, assign, smt.getValue(assign))
            assigns = exprmgr.mkExpr(AND, assigns, assign)

        blocking = exprmgr.mkExpr(NOT, assigns)

        Logger.log("Blocking: %s"%(blocking.toString()), 1)
        
        return ([blocking], "(%s)"%" & ".join(model))


    def __bdd_simplification(self, strformula, lst=False):

        variables = re.sub('[~\&\|\(\)]',' ',strformula)
        variables = re.sub(' +',' ',variables.strip())
        variables = variables.split(" ")
        
        bdd = BDD()
        [bdd.add_var(var) for var in variables]

        u = bdd.add_expr(strformula)
        dnf = self.__get_dnf(bdd, u)

        conj = []
        for el in dnf:
            if el[0] == True:
                el = el[1:]
                el.reverse()
                conj.append("(%s)"%" & ".join(el))

        if lst:
            return conj
                
        return " | ".join(conj)

        
    
    def __get_dnf(self, bdd, u, paths=[[]]):
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
    
