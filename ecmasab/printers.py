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
import re
from six.moves import range

from ecmasab.execution import RELATIONS, BLOCKING_RELATIONS, For_Loop, ITE_Statement
from ecmasab.execution import READ, WRITE, INIT, SC, UNORD, MAIN, TYPE
from ecmasab.beparsing import T_INT8, T_INT16, T_INT32, T_FLO32, T_FLO64
from ecmasab.exceptions import UnreachableCodeException


class NotRegisteredPrinterException(Exception):
    pass

class PrinterType(object):
    SMT = 0
    JS = 1
    GRAPH = 2
    BEXEC = 3

class PrintersFactory(object):
    printers = {}

    # Additional printers should be registered here #
    @staticmethod
    def init_printers():
        PrintersFactory.register_printer(CVC4Printer())
        PrintersFactory.register_printer(JSV8Printer())
        PrintersFactory.register_printer(JSSMPrinter())
        PrintersFactory.register_printer(DotPrinter())
        PrintersFactory.register_printer(BePrinter())
    
    @staticmethod
    def register_printer(printer):
        if printer.NAME not in PrintersFactory.printers:
            PrintersFactory.printers[printer.NAME] = printer

    @staticmethod    
    def printer_by_name(name):
        PrintersFactory.init_printers()
        if name not in PrintersFactory.printers:
            raise NotRegisteredPrinterException
        return PrintersFactory.printers[name]

    @staticmethod    
    def get_printers():
        PrintersFactory.init_printers()
        return PrintersFactory.printers.keys()

    @staticmethod    
    def get_printers_by_type(printertype):
        PrintersFactory.init_printers()
        return [v for v in PrintersFactory.printers.values() if v.TYPE == printertype]
    
class JSPrinter(object):
    NAME = "JS-PRINTER"
    TYPE = PrinterType.JS

    def __init__(self):
        pass

    def print_executions(self, program, interps):
        pass

    def print_execution(self, program, interp):
        pass
    
    def print_program(self, program):
        pass
    
    def print_event(self, event):
        pass
        
class CVC4Printer(object):
    NAME = "CVC4"
    TYPE = PrinterType.SMT

    def __init__(self):
        pass

    def print_executions(self, interps):
        ret = []
        for interp in interps.executions:
            ret.append(self.print_execution(interp))

        return "\n".join(ret)

    def print_assertions(self, interps):
        ret = []
        for interp in interps.executions:
            ret.append(self.print_assert_execution(interp))

        return ret
    
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
    
    def print_assert_execution(self, interp):
        relations = []
        for relation in BLOCKING_RELATIONS:
            relations.append(interp.get_relation_by_name(relation))

        relations = [self.__print_relation(x) for x in relations]

        conds = []
        if interp.conditions:
            conds += ["(%s=%s)"%x for x in interp.conditions]
            
        ret = " AND ".join(relations+conds)
            
        return "ASSERT NOT(%s);"%(ret)
    
    
    def __print_relation(self, relation):
        tuples = relation.tuples
        return "%s = {%s}"%(relation.name, ", ".join([self.__print_tuple(x) for x in tuples]))

    def __print_tuple(self, tup):
        if len(tup) > 2:
            return "((%s), %s)"%((", ".join([str(x) for x in tup[:2]])), tup[-1])
        return "(%s)"%(", ".join([str(x) for x in tup]))
    
    def print_program(self, program):
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
            ret += self.__print_thread_program_order(thread) + "\n"

        ret += self.__print_event_set(program)[0] + "\n"
        ret += self.__print_agent_order(program) + "\n"
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
    
    def __print_agent_order(self, program):
        ao = [x.name+".PO" for x in program.threads]
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

        ret = ""
        ret += "ASSERT comp_RF = {%s};\n"%(", ".join(compat_events))
        ret += "ASSERT comp_RBF = {%s};"%(", ".join(compat_bytes_events))

        return ret

class JSV8Printer(JSPrinter):
    NAME = "JS-V8"

    float_app_js = ".toFixed(2)"
    float_pri_js = "%.2f"
    
    def print_executions(self, program, interps):
        return "\n".join(self.compute_possible_executions(program, interps))

    def compute_possible_executions(self, program, interps):
        ret = set([])
        for interp in interps.get_valid_executions():
            ret.add(self.print_execution(program, interp))

        return list(ret)
    
    def print_execution(self, program, interp):
        reads = []
        for el in interp.reads_values:
            value = el.get_correct_value()
            if el.is_wtear():
                if (self.float_pri_js%value) == "-0.00":
                    value = 0
                reads.append(("%s: "+self.float_pri_js)%(el.name, value))
            else:
                reads.append("%s: %s"%(el.name, value))
        return ";".join(reads)

    def print_program(self, program):
        program.sort_threads()
        
        ret = ""
        ret += "if (this.Worker) {\n"
        ret += "(function execution() {\n"

        for thread in program.threads:
            if thread.name == MAIN:
                continue
            ret += "var %s =\n"%thread.name
            ret += "`onmessage = function(data) {\n"
            for ev in thread.get_events(False):
                if isinstance(ev, For_Loop):
                    ret += self.print_floop(ev)
                elif isinstance(ev, ITE_Statement):
                    ret += self.print_ite(ev)
                else:
                    ret += self.print_event(ev)

            ret += "};`;\n"


        blocks = [(x.name, x.size) for x in program.get_blocks()]
        blocks.sort()
        ret += "var data = {\n"
        for sab in blocks:
            size = sab[1]
            if (size % 8) != 0:
                size = (int(size / 8)+1) * 8
            ret += "%s_sab : new SharedArrayBuffer(%s),\n"%(sab[0], size)
        ret += "}\n"

        for thread in program.threads:
            if thread.name != MAIN:
                continue
            for ev in thread.get_events(True):
                ret += self.print_event(ev)


        for thread in program.threads:
            if thread.name == MAIN:
                continue
            ret += "var w%s = new Worker(%s);\n"%(thread.name, thread.name)


        block_pars = ", ".join(["data.%s_sab"%str(x[0]) for x in blocks])
        for thread in program.threads:
            if thread.name == MAIN:
                continue
            
            ret += "w%s.postMessage(data, [%s]);\n"%(thread.name, block_pars)

        ret += "})();\n"
        ret += "}\n"

        return ret

    def print_floop(self, floop):
        ret = ""
        ret += "for(%s = %s; %s <= %s; %s++){\n"%(floop.cname, \
                                                 floop.fromind, \
                                                 floop.cname, \
                                                 floop.toind,
                                                 floop.cname)
        for ev in floop.events:
            ret += self.print_event(ev, floop.cname)

        ret += "}\n"

        return ret

    def print_ite(self, ite):
        ret = ""

        for cond in ite.conditions:
            ret += self.print_event(cond[0])

        conditions = ["%s %s %s"%x for x in ite.conditions]
        ret += "if(%s) {\n"%(" AND ".join(conditions))

        for ev in ite.then_events:
            ret += self.print_event(ev)

        ret += "} else {\n"
            
        for ev in ite.else_events:
            ret += self.print_event(ev)
            
        ret += "}\n"

        return ret
    
    def print_event(self, event, postfix=None):
        operation = event.operation
        ordering = event.ordering
        block_name = event.block.name
        event_name = event.name
        event_address = event.address
        block_size = event.get_size()
        is_float = event.is_wtear()
        var_def = ""
        prt = ""
        
        if (ordering != INIT):
            if is_float:
                var_def = "var %s = new Float%sArray(data.%s)"%(block_name, \
                                                                  block_size*8, \
                                                                  block_name+"_sab")
            else:
                var_def = "var %s = new Int%sArray(data.%s)"%(block_name, \
                                                           block_size*8, \
                                                           block_name+"_sab")

        if (operation == WRITE) and (ordering == INIT):
            mop = ""


        if (ordering == SC) and not is_float:
            if not event_address:
                addr = event.offset
                event_values = event.value
            else:
                addr = int(event_address[0]/block_size)
                event_values = event.get_correct_value()

            if operation == WRITE:
                mop = "Atomics.store(%s, %s, %s)"%(block_name, \
                                                        addr, \
                                                        event_values)


            if operation == READ:
                mop = "%s = Atomics.load(%s, %s)"%(event_name, \
                                                          block_name, \
                                                          addr)
                if postfix:
                    prt = "print(\"%s_\"+%s+\": \"+%s)"%(event_name, postfix, event_name)
                else:
                    prt = "print(\"%s: \"+%s)"%(event_name, event_name)

        if (ordering == UNORD) or is_float:
            if not event_address:
                addr = event.offset
                event_values = event.value
            else:
                addr = int(event_address[0]/block_size)
                event_values = event.get_correct_value()
                    
            if operation == WRITE:
                if is_float and event_address:
                    event_values = self.float_pri_js%event_values

                mop = ("%s[%s] = %s")%(block_name, \
                                              addr, \
                                              event_values)

            if operation == READ:
                approx = self.float_app_js if is_float else ""
                    
                mop = "%s = %s[%s]"%(event_name, \
                                            block_name, \
                                            addr)

                if postfix:
                    prt = "print(\"%s_\"+%s+\": \"+%s%s)"%(event_name, postfix, event_name, approx)
                else:
                    prt = "print(\"%s: \"+%s%s)"%(event_name, event_name, approx)

        if operation == READ:
            return "%s; %s; %s;\n"%(var_def,mop,prt)
        else:
            return "%s; %s;\n"%(var_def,mop)


class JSSMPrinter(JSPrinter):
    NAME = "JS-SM"
    
    def print_executions(self, program, interps):
        pass

    def print_execution(self, program, interp):
        pass
    
    def print_program(self, program):
        pass
    
    def print_event(self, event):
        pass
    

class DotPrinter(object):
    NAME = "DOT"
    TYPE = PrinterType.GRAPH
    float_pri_js = "%.2f"
    printing_relations = None

    def __init__(self):
        self.printing_relations = []

    def print_executions(self, program, interps):
        graphs = []
        for interp in interps.get_valid_executions():
            graphs.append(self.print_execution(program, interp))
        return graphs

    def add_printing_relation(self, relation):
        if relation not in self.printing_relations:
            self.printing_relations.append(relation)

    def set_printing_relations(self, relations):
        if relations:
            for relation in relations.split(","):
                if relation not in RELATIONS:
                    raise UnreachableCodeException("Not found relation \"%s\""%(relation))
                self.add_printing_relation(relation)

    def __should_print(self, relation):
        if not len(self.printing_relations):
            return True
        return relation in self.printing_relations

            
    def print_execution(self, program, interp):

        reads_dic = dict([(x.name, x) for x in interp.reads_values])
        ev_dic = dict([(x.name, x) for x in interp.get_events()])

        ret = []
        ret.append("digraph memory_model {")
        ret.append("rankdir=LR;")

        ret.append("splines=true; esep=0.5;")

        color = "red"
        if self.__should_print(interp.get_RBF().name):
            for tup in interp.get_RBF().tuples:
                label = "%s[%s]"%(interp.get_RBF().name, tup[2])
                ret.append("%s -> %s [label = \"%s\", color=\"%s\"];" % (tup[0], tup[1], label, color))

        relations = []
        defcolor = "black"
        colors = dict([(interp.get_RF(), "red"),\
                       (interp.get_SW(), "blue")])
        
        for relation in RELATIONS:
            if (relation != interp.get_RBF().name):
                if self.__should_print(relation):
                    relations.append(interp.get_relation_by_name(relation))

        event_to_thread = []
        for thread in program.threads:
            event_to_thread += [(x.name, thread) for x in thread.get_events(True)]
        event_to_thread = dict(event_to_thread)
                    
        for relation in relations:
            label = relation.name
            for tup in relation.tuples:
                if len(self.printing_relations):
                    rel_HB = (relation.name == interp.get_HB().name)
                    rel_MO = (relation.name == interp.get_MO().name)
                    if rel_HB or rel_MO:
                        # not consequent events
                        cond1a = event_to_thread[tup[0]] == event_to_thread[tup[1]]
                        cond1b = ev_dic[tup[1]].id_ev > (ev_dic[tup[0]].id_ev + 1)
                        cond1 = cond1a and cond1b

                        # not init events
                        cond2a = ev_dic[tup[0]].is_init() and not(ev_dic[tup[1]].is_init())
                        cond2b = tup[1] != event_to_thread[tup[1]].get_events(True)[0].name
                        cond2 = cond2a and cond2b

                        if cond1 or cond2:
                            continue
                ret.append("%s -> %s [label = \"%s\", color=\"%s\"];" % (tup[0], \
                                                                         tup[1], \
                                                                         label, \
                                                                         colors[relation] if relation in colors else defcolor))
                

        sepx = 5
        sepy = 2
        
        posx = ((len(program.threads)-2)*sepx)/2.0
        maxy = max([len(x.get_events(True)) for x in program.threads])*sepy
        posy = maxy
        
        for thread in program.threads:
            if thread.name == MAIN:
                for event in thread.get_events(True):
                    node = self.__print_event(event, reads_dic, posx, posy)
                    ret.append(node)
                    posy -= sepy

        posx = 0
        sposy = posy
                    
        for thread in program.threads:
            posy  = sposy
            if thread.name != MAIN:
                for event in thread.get_events(True):
                    node = self.__print_event(event, reads_dic, posx, posy)
                    ret.append(node)
                    posy -= sepy
                posx += sepx
        ret.append("}")
                
        return "\n".join(ret)

    def __print_event(self, event, reads_dic, posx, posy):
        if event.name in reads_dic:
            event = reads_dic[event.name]
            value = event.get_correct_value()
            bname = "%s%s[%s]"%(event.block.name, self.__get_block_size(event), event.address[0])
        else:
            if event.is_init():
                value = 0
                bname = "%s-init"%event.block.name
            else:
                value = event.get_correct_value()
                bname = "%s%s[%s]"%(event.block.name, self.__get_block_size(event), event.address[0])
            
        value = self.float_pri_js%value if event.is_wtear() else value
        oper = "=" if event.is_read() else ":="
        label = "%s<br/><B>%s %s %s</B>"%(event.name, bname, oper, value)
        node = "%s [label=<%s>, pos=\"%s,%s!\"]"%(event.name, label, posx, posy)

        return node

    
    def __get_block_size(self, event):
        size = event.get_size()
        isfloat = event.is_wtear()
        
        if not isfloat:
            if size == 1:
                return T_INT8
            elif size == 2:
                return T_INT16
            elif size == 4:
                return T_INT32
            else:
                raise UnreachableCodeException("Int size %s not valid"%str(size))
            
        if isfloat:
            if size == 4:
                return T_FLO32
            elif size == 8:
                return T_FLO64
            else:
                raise UnreachableCodeException("Float size %s not valid"%str(size))
    
class BePrinter(object):
    NAME = "BE"
    TYPE = PrinterType.BEXEC

    float_pri_js = "%.2f"
    
    def __init__(self):
        pass

    def print_execution(self, program):
        return self.print_program(program)
    
    def print_program(self, program):
        program.sort_threads()
        ret = ""

        blocks = [x.name for x in program.get_blocks()]
        blocks.sort()
        for sab in blocks:
            ret += "var %s = new SharedArrayBuffer();\n"%(sab)

        for thread in program.threads:
            if thread.name != MAIN:
                continue
            for ev in thread.get_events(True):
                ret += self.print_event(ev)

        for thread in program.threads:
            if thread.name == MAIN:
                continue
            ret += "Thread %s {\n"%(thread.name)
            for ev in thread.get_events(False):
                if isinstance(ev, For_Loop):
                    ret += self.print_floop(ev)
                elif isinstance(ev, ITE_Statement):
                    ret += self.print_ite(ev)
                else:
                    ret += self.print_event(ev)

            ret += "}\n"
                
        return ret

    def print_event(self, event, pure=False):
        operation = event.operation
        ordering = event.ordering
        block_name = event.block.name
        event_address = event.address
        block_size = event.get_size()
        is_float = event.is_wtear()

        if (ordering == INIT):
            return ""
        
        if (ordering == SC) and not is_float:
            if not event_address:
                addr = event.offset
                event_values = event.value
            else:
                addr = int(event_address[0]/block_size)
                event_values = event.get_correct_value()

            if operation == WRITE:
                ret = "Atomics.store(%s%s, %s, %s)"%(block_name, \
                                                     self.__get_block_size(block_size, False), \
                                                     addr, \
                                                     event_values)


            if operation == READ:
                ret = "Atomics.load(%s%s, %s)"%(block_name, \
                                                self.__get_block_size(block_size, False), \
                                                addr)

        if (ordering == UNORD) or is_float:
            if not event_address:
                addr = event.offset
                event_values = event.value
            else:
                addr = int(event_address[0]/block_size)
                event_values = event.get_correct_value()

            if operation == WRITE:
                if is_float and event_address:
                    event_values = self.float_pri_js%event_values
                    event_values = re.sub("0+\Z","", event_values)
                
                ret = ("%s%s[%s] = %s")%(block_name, \
                                         self.__get_block_size(block_size, is_float),\
                                         addr, \
                                         event_values)

            if operation == READ:
                ret = "%s%s[%s]"%(block_name, \
                                  self.__get_block_size(block_size, is_float),\
                                  addr)            

        if not pure:
            if operation == READ:
                ret = "print(%s);\n"%ret
            else:
                ret = "%s;\n"%ret
                
        return ret


    def __get_block_size(self, size, isfloat):
        if not isfloat:
            if size == 1:
                return T_INT8
            elif size == 2:
                return T_INT16
            elif size == 4:
                return T_INT32
            else:
                raise UnreachableCodeException("Int size %s not valid"%str(size))
            
        if isfloat:
            if size == 4:
                return T_FLO32
            elif size == 8:
                return T_FLO64
            else:
                raise UnreachableCodeException("Float size %s not valid"%str(size))
    
    def print_floop(self, floop):
        ret = ""
        ret += "for(%s = %s..%s) {\n"%(floop.cname, \
                                    floop.fromind, \
                                    floop.toind)
        for ev in floop.events:
            ret += self.print_event(ev)

        ret += "}\n"

        return ret

    def print_ite(self, ite):
        ret = ""
        conditions = ["%s %s %s"%(self.print_event(x[0], True), x[1], x[2]) for x in ite.conditions]
        ret += "if(%s) {\n"%(" AND ".join(conditions))
        
        for ev in ite.then_events:
            ret += self.print_event(ev)

        ret += "} else {\n"
            
        for ev in ite.else_events:
            ret += self.print_event(ev)
            
        ret += "}\n"

        return ret

    
    
