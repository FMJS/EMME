# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

class EvaluationResult(object):

class Evaluator(object):
    mmatched = None
    nmatched = None
    
    def __init__(self, mmatched, nmatched):
        self.mmatched = mmatched
        self.nmatched = nmatched


    def differential_evaluation(self):
        mmatched_RBF = set([])
        nmatched_RBF = set([])

        for mmatch in self.mmatched.executions:
            mmatched_RBF = mmatched_RBF.union(set(mmatch.get_RBF_list()))

        for nmatch in self.nmatched.executions:
            nmatched_RBF = nmatched_RBF.union(set(nmatch.get_RBF_list()))

        mmatched_HB = set([])
        nmatched_HB = set([])

        for mmatch in self.mmatched.executions:
            mmatched_HB = mmatched_HB.union(set(mmatch.get_HB().tuples))

        for nmatch in self.nmatched.executions:
            nmatched_HB = nmatched_HB.union(set(nmatch.get_HB().tuples))


        return (list(nmatched_RBF.difference(mmatched_RBF)),
                list(nmatched_HB.difference(mmatched_HB)),
                list(nmatched_HB),
                list(mmatched_RBF))

