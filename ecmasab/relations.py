# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import re
import sys

AOT = "AOT"
CR = "CR"
SCA = "SCA"
VE = "VE"
TFR = "TFR"
RF = "RF"
RBF = "RBF"
AO = "AO"
PO = "PO"
HB = "HB"
SW = "SW"
MO = "MO"
DO = "DO"

class Tuple():
    elements = None

    def __init__(self):
        self.elements = []

    def __repr__(self):
        return str(self.elements)
        
    def from_list(self, list):
        self.elements = tuple(list)
        return self

    def get_element(self, index):
        return self.elements[index]
    
class Relation():
    name = None
    elements = None

    def __init__(self):
        self.elements = []
        self.name = ""


    def __repr__(self):
        return "%s = %s"%(self.name, self.elements)
        
    def from_string(self, relstr):
        relstr = relstr.replace(" ","")
        relstr = relstr.split("=")
        self.name = relstr[0]

        for tup in re.findall("(?<=\()[a-zA-Z0-9_,]*(?=\))", relstr[1]):
            tup = tup.split(",")
            self.elements.append(Tuple().from_list(tup))

        return self

    def is_empty(self):
        return (self.elements == []) or (self.elements == None)
            
    def get_name(self):
        return self.name

    def get_elements(self):
        return self.elements
    
