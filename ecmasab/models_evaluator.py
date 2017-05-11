# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

class MatchType(object):
    MA = 0 # Matched
    UN = 1 # Unmatched
    MU = 2 # Difference, Matched \ Unmatched
    UM = 3 # Difference, Unmatched \ Matched
    ALL = 4 # All

class EvaluationResults(object):
    un_RBFs = None
    ma_RBFs = None
    un_union_RBF = None
    ma_union_RBF = None

    un_HBs = None
    ma_HBs = None
    un_union_HB = None
    ma_union_HB = None
    
    def __init__(self):
        self.un_RBFs = None
        self.ma_RBFs = None
        self.un_union_RBF = None
        self.ma_union_RBF = None

        self.un_HBs = None
        self.ma_HBs = None
        self.un_union_HB = None
        self.ma_union_HB = None

    def get_u_RBF(self, matched=MatchType.ALL):
        return self.__get_u_rel(matched, self.ma_union_RBF, self.un_union_RBF)

    def get_u_HB(self, matched=MatchType.ALL):
        return self.__get_u_rel(matched, self.ma_union_HB, self.un_union_HB)
    
    def __get_u_rel(self, matched, ma_rel, un_rel):
        if matched == MatchType.ALL:
            return ma_rel.union(un_rel)
        elif matched == MatchType.MA:
            return ma_rel
        elif matched == MatchType.UN:
            return un_rel
        elif matched == MatchType.MU:
            return ma_rel.difference(un_rel)
        elif matched == MatchType.UM:
            return un_rel.difference(ma_rel)
        else:
            return None
        
class Evaluator(object):
    mmatched = None
    nmatched = None

    results = None
    
    def __init__(self, mmatched, nmatched):
        self.mmatched = mmatched
        self.nmatched = nmatched
        self.results = EvaluationResults()

        self.differential_evaluation()

    def differential_evaluation(self):
        ma_union_RBF = set([])
        un_union_RBF = set([])

        for mmatch in self.mmatched.executions:
            ma_union_RBF = ma_union_RBF.union(set(mmatch.get_RBF_list()))

        for nmatch in self.nmatched.executions:
            un_union_RBF = un_union_RBF.union(set(nmatch.get_RBF_list()))

        ma_union_HB = set([])
        un_union_HB = set([])

        for mmatch in self.mmatched.executions:
            ma_union_HB = ma_union_HB.union(set(mmatch.get_HB().tuples))

        for nmatch in self.nmatched.executions:
            un_union_HB = un_union_HB.union(set(nmatch.get_HB().tuples))

        self.results.ma_union_RBF = ma_union_RBF
        self.results.un_union_RBF = un_union_RBF
        self.results.ma_union_HB = ma_union_HB
        self.results.un_union_HB = un_union_HB

        return self.results

