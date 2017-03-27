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
import itertools
import ast
import subprocess
from six.moves import range

CPP = "cpp"

class QuantPreprocessor(object):
    expand_sets = None
    verbosity = None

    FORALL = "FORALL"
    BIGUNION = "BIGUNION"
    BIGSUM = "BIGSUM"
    EXISTS = "EXISTS"
    
    def __init__(self):
        self.expand_sets = True
        self.verbosity = 0

    def set_verbosity(self, verbosity):
        self.verbosity = verbosity
        
    def set_expand_sets(self, value):
        self.expand_sets = value

    def __cleanup_model(self, model):
        lines = [x for x in model.split("\n") if ((x != "") and (x[0] != '%'))]
        return "\n".join(lines)
    
    def preprocess_from_string(self, strinput):
        strinput = self.__cleanup_model(strinput)
        
        set_dict = {}
        set_type_dict = {}

        for set_ass in re.findall("[a-zA-Z0-9_\.]* *= \{*[a-zA-Z0-9_, ]*\}(?=[;|\)])", strinput):
            set_ass = set_ass.replace(" ","")
            set_ass = set_ass.split("=")
            set_dict[set_ass[0]] = set_ass[1][1:-1].split(",")

        for set_def in re.findall("(.*):(.*)(SET OF)(.*)(?=;)", strinput):
            set_name = set_def[0].replace(" ","")
            set_type = set_def[3].replace(" ","")
            set_type_dict[set_name] = set_type

        quantifiers = re.findall("(?<=ASSERT ).*[BIGSUM|BIGUNION|FORALL|EXISTS].*IN.*(?=;)", strinput)

        for el in quantifiers:
            tmp = self.__process_quantifier(self.__parse_formula(el), set_dict, set_type_dict)
            strinput = strinput.replace(el, self.__print_formula(tmp))

        return strinput
    
    def __print_formula(self, formula):
        ret = ""
        if type(formula) == list:
            for el in formula:
                ret += self.__print_formula(el)
        else:
            return str(formula)
        return ret


    def __parse_formula(self, string):

        string = string.replace("[","___ob___")
        string = string.replace("]","___cb___")

        ret = ""
        string = "("+string+")"

        string = string.replace("(","[\"(")
        string = string.replace(")",")\"]")

        par = 0
        for char in string:
            if char == "[":
                par += 1
            if char == "]":
                par -= 1

            if (par > 1) and (char == "["):
                ret += "\", ["
            elif (par > 0) and (char == "]"):
                ret += "], \""
            else:
                ret += char

        ret = ret.replace(", \"\"","")
        ret = ret.replace("\"\", ","")

        ret = ret.replace("___ob___", "[")
        ret = ret.replace("___cb___", "]")

        ret = ast.literal_eval(ret)

        return ret
    
    def __sub_quantifier_expand(self, formula, quantifier, set_dict):
        formula = self.__print_formula(formula)
        new_formula = self.__get_all_splits(formula[formula.find("%s "%quantifier):-1], set_dict)
        operation = " AND " if quantifier == self.FORALL else \
                    " OR " if quantifier == self.EXISTS else \
                    " | " if quantifier == self.BIGUNION else \
                    " + " if quantifier == self.BIGSUM else None
        new_formula = operation.join(new_formula)
        return "(%s)"%new_formula

    def __sub_quantifier(self, formula, quantifier, set_type_dict):
        elements = formula[1][0]
        elements = elements.replace("(","")
        elements = elements.replace(")","")
        elements = elements.split("IN")
        theset = elements[1].replace(" ", "")
        elements = elements[0].replace(" ", "").split(",")

        new_formula = self.__print_formula(formula[3])

        precondition = []
        for el in elements:
            precondition.append("(%s IS_IN %s)"%(el, theset))

        precondition = " AND ".join(precondition)

        if theset in set_type_dict:
            dict_type = set_type_dict[theset]
        else:
            dict_type = "INT"

        new_formula = "(%s (%s : %s) : ((%s) %s (%s)))" % (quantifier, \
                                                           ", ".join(elements), \
                                                           dict_type, \
                                                           precondition, \
                                                           "=>" if quantifier == self.FORALL else "AND", \
                                                           new_formula)

        return new_formula

    def __process_quantifier_int(self, formula, set_dict, set_type_dict, sup):
        cond1 = False
        cond2 = False
        cond3 = False

        quantifier = None

        if type(formula) == list:
            quantifier = self.FORALL if (self.FORALL in formula[0]) else \
                         self.EXISTS if (self.EXISTS in formula[0]) else \
                         self.BIGUNION if (self.BIGUNION in formula[0]) else \
                         self.BIGSUM if (self.BIGSUM in formula[0]) else None
            cond1 = quantifier is not None
            if (len(formula) > 1):
                cond2 = ((len(formula[1])> 0) and (" IN " in formula[1][0]))
                cond3 = (" IN " not in self.__print_formula(formula[2:]))

        if cond1 and cond2 and cond3:
            if self.verbosity > 1:
                print("%% Processing quantifier %s: %s" % (quantifier, self.__print_formula(formula)))
            if self.expand_sets or (quantifier == self.BIGUNION) or (quantifier == self.BIGSUM):
                value = self.__sub_quantifier_expand(formula, quantifier, set_dict)
            else:
                value = self.__sub_quantifier(formula, quantifier, set_type_dict)
            sup[0] = True
            return value
        else:
            if type(formula) == list:
                for i in range(len(formula)):
                    formula[i] = self.__process_quantifier_int(formula[i], set_dict, set_type_dict, sup)

        return formula

    def __process_quantifier(self, formula, set_dict, set_type_dict):
        sup = [True]
        while sup[0]:
            sup = [False]
            formula = self.__process_quantifier_int(formula, set_dict, set_type_dict, sup)

        return formula

    def __get_all_splits(self, el, set_dict):
        set_range = re.search("(?<=IN\s)\s*[a-zA-Z0-9_\.]*\s*(?=\)\s:)", el).group(0)
        formula = re.search("(?<=:\s).*", el).group(0)
        variables = re.search("(?<=\()[a-zA-Z0-9_\., ]*(?= IN )", el)

        assert(variables)

        variables = variables.group(0)
        variables = variables.replace(" ", "")
        variables = variables.split(",")

        assert(set_range in set_dict)

        permutations = list(itertools.permutations(set_dict[set_range], len(variables)))

        if len(variables) > 1:
            for el in set_dict[set_range]:
                permutations.append(tuple([el] * len(variables)))

        new_formula = []

        for permutation in permutations:
            formula_loc = formula
            i = 0
            for variable in variables:
                formula_loc = formula_loc.replace(variable, permutation[i])
                i += 1

            new_formula.append("(%s)"%formula_loc)

        return new_formula



class ExtPreprocessor(object):
    pproc = None
    output_file = None
    defines = None
    
    def __init__(self, pproc):
        self.pproc = pproc
        self.output_file = "/tmp/__model__"
        self.defines = None

    def set_output_file(self, output_file):
        self.output_file = output_file

    def set_defines(self, defines):
        self.defines = defines
        
    def preprocess_from_string(self, strinput):
        with open(self.output_file, "w") as f:
            f.write(strinput)

        return self.preprocess_from_file(self.output_file)

    def preprocess_from_file(self, filename):
        command = []
        command.append("%s"%self.pproc)
        if self.defines is not None:
            for define in self.defines.split(","):
                if define == "": continue
                command.append("-D %s" % define)
        command.append("%s" % filename)

        process = subprocess.Popen(command, stdout=subprocess.PIPE, close_fds=True)
        out = process.communicate()[0]

        out = out.split(b"\n")

        for x in range(len(out)):
            out[x] = str(out[x].decode('utf-8'))
            if re.search("\A\s*\#", out[x]) is not None:
                out[x] = '\n'

        return "\n".join(out)

