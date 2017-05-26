# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import itertools
from six.moves import range

from ecmasab.execution import Executions
from ecmasab.execution import TYPE
from ecmasab.parsing import T_DONE

class CVC4Encoder(object):
    def __init__(self):
        pass

    def print_executions(self, interps):
        ret = []
        for interp in interps.executions:
            ret.append(self.print_execution(interp))

        return "\n".join(ret)

    def print_done(self):
        return T_DONE
    
    def print_execution(self, interp):
        relations = []
        relations.append(interp.get_HB())
        relations.append(interp.get_MO())
        relations.append(interp.get_RBF())
        relations.append(interp.get_RF())
        relations.append(interp.get_SW())

        values = [self.__print_relation(x) for x in relations]
        if interp.conditions:
            values += ["(%s=%s)"%x for x in interp.conditions]
        
        return " AND ".join(values)

    def big_or(self, formulas):
        return " OR ".join(formulas)

    def big_and(self, formulas):
        return " AND ".join(formulas)
    
    def assert_formula_nl(self, formula):
        return self.assert_formula("%s\n"%formula)
    
    def assert_formula(self, formula):
        end = ""
        formula = formula.replace("{}", "empty_rel_set")
        if formula[-1] == "\n":
            formula = formula[:-1]
            end = ";\n"
        return "ASSERT (%s)%s"%(formula, end)
    
    def print_neg_assertions(self, interps, relations):
        return ["ASSERT NOT(%s);"%self.print_assert_execution(x, relations) for x in interps.executions]

    def print_ex_assertions(self, interps, relations):
        execs = [self.print_assert_execution(x, relations) for x in interps.executions]
        return "ASSERT (%s);"%(" OR ".join(execs))
        
    def print_assert_execution(self, interp, relations):
        outrelations = [interp.get_relation_by_name(x) for x in relations]
        outrelations = [self.__print_relation(x) for x in outrelations]
        conds = []
        if interp.conditions:
            conds += ["(%s=%s)"%x for x in interp.conditions]

        ret = " AND ".join(outrelations+conds)
        ret = ret.replace("{}", "empty_rel_set")
        return ret

    def print_general_AO(self, program):
        events = program.get_events()
        ret = ""
        
        for i in range(len(events)):
            ret += "ev_t%s : SET OF MEM_OP_TYPE;\n"%(i+1)

        for ev in events:
            if program.has_conditions():
                ret += "ASSERT (%s.A = ENABLED) <=> %s;\n"%(ev, " OR ".join(["(%s IS_IN %s)"%(ev, x) for x in ["ev_t%s"%(x+1) for x in range(len(events))]]))
            else:
                ret += "ASSERT %s;\n"%(" OR ".join(["(%s IS_IN %s)"%(ev, x) for x in ["ev_t%s"%(x+1) for x in range(len(events))]]))

        for ev in events:
            for i in range(len(events)):
                ret += "ASSERT (%s IS_IN ev_t%s => NOT(%s));\n"%(ev, i+1, " OR ".join(["(%s IS_IN ev_t%s)"%(ev, j+1) for j in range(len(events)) if i!=j]))
        
        for i in range(len(events)):
            tname = "t%s"%(i+1)
            ret += "AO_%s : EV_REL;\n"%(tname)
            ret += "ASSERT AO_%s = TCLOSURE(AO_%s);\n"%(tname, tname)
            ret += "ASSERT ((FORALL (e1,e2 IN ev_set) : ((NOT(e1 = e2) AND (e1 IS_IN ev_%s) AND (e2 IS_IN ev_%s)) => (((e1,e2) IS_IN AO_%s) OR ((e2,e1) IS_IN AO_%s)))));\n"%(tname, tname, tname, tname)

        ret += "ASSERT AO <= pair_ev_set;\n"
        ret += "ASSERT AO = %s;\n"%(" | ".join(["AO_t%s"%(x+1) for x in range(len(events))]))

        return ret
    
    def __print_relation(self, relation):
        tuples = relation.tuples
        return "%s = {%s}"%(relation.name, ", ".join([self.__print_tuple(x) for x in tuples]))

    def __print_tuple(self, tup):
        if len(tup) > 2:
            return "((%s), %s)"%((", ".join([str(x) for x in tup[:2]])), tup[-1])
        return "(%s)"%(", ".join([str(x) for x in tup]))
    
    def print_program(self, program, relaxed_order=False):
        program.sort_threads()

        ret = ""
        ret += self.__print_conditions(program) + "\n"
        conditional = program.has_conditions()
        
        for thread in program.threads:
            ret += self.print_thread(thread) + "\n"

        for thread in program.threads:
            for event in thread.get_events(True):
                ret += self.print_event(event, conditional) + "\n"

        for thread in program.threads:
            ret += self.__print_thread_events_set(thread) + "\n"
            if not relaxed_order:
                ret += self.__print_thread_program_order(thread) + "\n"

        ret += self.__print_event_set(program)[0] + "\n"
        ret += self.__print_agent_order(program, relaxed_order) + "\n"
        ret += self.__print_locations(program) + "\n"
        ret += self.__print_compatible_reads(program) + "\n"
            
        return ret

    def print_thread(self, thread):
        return "%s : THREAD_TYPE;" % thread.name
    
    def print_event(self, event, conditional):
        return "%s : MEM_OP_TYPE;\n%s" % (event.name, self.print_event_formula(event, conditional))
    
    def print_event_formula(self, event, conditional):
        ret = "ASSERT "
        indent = " "*len(ret)
        ret +=  "(%s.ID = %s) AND\n" % (event.name, str(event.name)+TYPE)
        ret += "%s(%s.O = %s) AND\n" % (indent, event.name, str(event.operation))
        ret += "%s(%s.T = %s) AND\n" % (indent, event.name, str(event.tear))
        ret += "%s(%s.R = %s) AND\n" % (indent, event.name, str(event.ordering))
        if type(event.address[0]) == int:
            address = "{%s}" % (", ".join(["Int(%s)" % el for el in event.address]))
            ret += "%s(%s.M = %s) AND\n" % (indent, event.name, address)
            
        if conditional:
            if event.en_conditions:
                condition = []
                for el in event.en_conditions:
                    if el[1]:
                        condition.append("(%s)"%el[0])
                    else:
                        condition.append("(NOT (%s))"%el[0])

                ret +=  "%s((%s.A = ENABLED) <=> (%s)) AND\n" % (indent, event.name, " AND ".join(condition))
            else:
                ret +=  "%s(%s.A = ENABLED) AND\n" % (indent, event.name)

        ret += "%s(%s.B = %s);\n"    % (indent, event.name, str(event.block))

                
        return ret

    def __print_thread_events_set(self, thread):
        return "ASSERT %s.E = {%s};" % (str(thread.name), str(", ".join([x.name for x in thread.get_events(True)])))
    
    def __print_thread_program_order(self, thread):
        if len(thread.get_events(True)) < 2:
            return "ASSERT %s.PO = empty_rel_set;" % (thread.name)
        thread_events = thread.get_events(True)
        pairs = []
        for i in range(len(thread_events)):
            for j in range(len(thread_events[i+1:])):
                pairs.append((thread_events[i].name, thread_events[i+j+1].name))
        
        pairs = [("(%s, %s)" % (x,y)) for x,y in pairs]
        return "ASSERT %s.PO = {%s};" % (thread.name, ", ".join(pairs))
    
    def __print_agent_order(self, program, inverted):
        ao = [x.name+".PO" for x in program.threads]
        if inverted:
            ret = "ASSERT NOT(AO = %s);" % (" | ".join(ao))
        else:
            ret = "ASSERT AO = %s;" % (" | ".join(ao))
            
        return ret

    def __print_conditions(self, program):
        if not program.get_conditions():
            return ""
        ret = []
        for condition in program.conditions:
            ret.append("%s: BOOLEAN;"%condition)

        return "\n".join(ret)
    
    def __print_event_set(self, program):
        events = []
        rom_events = []
        wom_events = []
        for thread in program.threads:
            events += [x for x in thread.get_events(True)]

        rom_events = [x.name for x in events if x.is_read_or_modify()]
        wom_events = [x.name for x in events if x.is_write_or_modify()]
        events = [x.name for x in events]

        permutations = list(itertools.permutations(events, 2))

        ret = ""
        ret += "ASSERT ev_set = {%s};\n" % (", ".join(events))
        ret += "ASSERT rom_ev_set = {%s};\n" % (", ".join(rom_events))
        ret += "ASSERT wom_ev_set = {%s};\n" % (", ".join(wom_events))
        ret += "ASSERT pair_ev_set = {%s};\n" % (", ".join(["(%s, %s)"%(x,y) for (x,y) in permutations]))
#        ret += "ASSERT pair_ev_set <= (ev_set PRODUCT ev_set);\n"

        return (ret, events)

    def __print_locations(self, program):
        events = program.get_events()
        max_size = 0
        sizes = []
        for event in events:
            if type(event.address[0]) == int:
                sizes.append(event.address[-1])
            else:
                sizes.append(event.address[-1][-1])

        max_size = max(sizes)
        return "ASSERT locs = {%s};" % (", ".join(["Int(%s)"%str(x) for x in range(max_size+1)]))
    
    def print_data_type(self, program):
        events = self.__print_event_set(program)[1]
        return "DATATYPE ID_TYPE = %s END;" % (" | ".join([str(x)+TYPE for x in events]))

    def print_block_type(self, program):
        blocks = program.get_blocks()
        return "DATATYPE BLOCK_TYPE = %s END;" % (" | ".join([str(x) for x in blocks]))

    def __print_compatible_reads(self, program):
        (compat_events, compat_bytes_events) = self.get_compatible_reads(program)
        ret = ""
        ret += "ASSERT comp_RF = {%s};\n"%(", ".join(compat_events))
        ret += "ASSERT comp_RBF = {%s};"%(", ".join(compat_bytes_events))

        return ret

    def get_compatible_reads(self, program):
        compat_events = []
        compat_bytes_events = []
        for read in [x for x in program.get_events() if x.is_read_or_modify()]:
            for write in [x for x in program.get_events() if x.is_write_or_modify()]:
                inters = 0

                rset = read.address
                rset = set(rset) if type(rset[0]) == int else set([y for x in rset for y in x])
                wset = write.address
                wset = set(wset) if type(wset[0]) == int else set([y for x in wset for y in x])

                inters = list(set(rset) & set(wset))
                        
                if (len(inters) > 0) and (read.block == write.block):
                    compat_events.append("(%s, %s)"%(read.name, write.name))
                for inter in inters:
                    compat_bytes_events.append("((%s, %s), Int(%s))"%(read.name, write.name, inter))

        return (compat_events, compat_bytes_events)
