# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import six
import itertools
import re

from ecmasab.execution import Executions, BLOCKING_RELATIONS, For_Loop
from ecmasab.execution import READ, WRITE, INIT, SC, UNORD, WTEAR, NTEAR, MAIN, TYPE
from ecmasab.beparsing import T_INT8, T_INT16, T_INT32, T_FLO32, T_FLO64
from ecmasab.exceptions import UnreachableCodeException


class NotRegisteredPrinterException(Exception):
    pass

class PrinterType():
    SMT = 0
    JS = 1
    GRAPH = 2
    BEXEC = 3

class PrintersFactory():
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
        if not name in PrintersFactory.printers:
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
    
class JSPrinter():
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
        
class CVC4Printer():
    NAME = "CVC4"
    TYPE = PrinterType.SMT

    def __init__(self):
        pass

    def print_executions(self, interps):
        ret = []
        for interp in interps.get_executions():
            ret.append(self.print_execution(interp))

        return "\n".join(ret)

    def print_assertions(self, interps):
        ret = []
        for interp in interps.get_executions():
            ret.append(self.print_assert_execution(interp))

        return ret
    
    def print_execution(self, interp):
        relations = []
        relations.append(interp.get_HB())
        relations.append(interp.get_MO())
        relations.append(interp.get_RBF())
        relations.append(interp.get_RF())
        relations.append(interp.get_SW())

        return " AND ".join([self.__print_relation(x) for x in relations])

    def print_assert_execution(self, interp):
        relations = []
        for relation in BLOCKING_RELATIONS:
            relations.append(interp.get_relation_by_name(relation))

        ret = " AND ".join([self.__print_relation(x) for x in relations])
        
        return "ASSERT NOT(%s);"%(ret)
    
    
    def __print_relation(self, relation):
        tuples = relation.get_tuples()
        return "%s = {%s}"%(relation.get_name(), ", ".join([self.__print_tuple(x) for x in tuples]))

    def __print_tuple(self, tup):
        if len(tup) > 2:
            return "((%s), %s)"%((", ".join([str(x) for x in tup[:2]])), tup[-1])
        return "(%s)"%(", ".join([str(x) for x in tup]))
    
    def print_program(self, program):
        program.sort_threads()

        ret = ""
        
        for thread in program.get_threads():
            ret += self.print_thread(thread) + "\n"

        for thread in program.get_threads():
            for event in thread.get_events(True):
                ret += self.print_event(event) + "\n"

        for thread in program.get_threads():
            ret += self.__print_thread_events_set(thread) + "\n"
            ret += self.__print_thread_program_order(thread) + "\n"

        ret += self.__print_event_set(program)[0] + "\n"
        ret += self.__print_agent_order(program) + "\n"
        ret += self.__print_locations(program) + "\n"
        ret += self.__print_compatible_reads(program) + "\n"
            
        return ret

    def print_thread(self, thread):
        return "%s : THREAD_TYPE;" % thread.get_name()
    
    def print_event(self, event):
        return "%s : MEM_OP_TYPE;\n%s" % (event.get_name(), self.print_event_formula(event))
    
    def print_event_formula(self, event):
        ret = "ASSERT "
        indent = " "*len(ret)
        ret +=  "(%s.ID = %s) AND\n" % (event.get_name(), str(event.get_name())+TYPE)
        ret += "%s(%s.O = %s) AND\n" % (indent, event.get_name(), str(event.get_operation()))
        ret += "%s(%s.T = %s) AND\n" % (indent, event.get_name(), str(event.get_tear()))
        ret += "%s(%s.R = %s) AND\n" % (indent, event.get_name(), str(event.get_ordering()))
        if type(event.get_address()[0]) == int:
            address = "{%s}" % (", ".join(["Int(%s)" % el for el in event.get_address()]))
            ret += "%s(%s.M = %s) AND\n" % (indent, event.get_name(), address)
        ret += "%s(%s.B = %s);\n"    % (indent, event.get_name(), str(event.get_block()))
        return ret

    def __print_thread_events_set(self, thread):
        return "ASSERT %s.E = {%s};" % (str(thread.get_name()), str(", ".join([x.get_name() for x in thread.get_events(True)])))
    
    def __print_thread_program_order(self, thread):
        if len(thread.get_events(True)) < 2:
            return "ASSERT %s.PO = empty_rel_set;" % (thread.get_name())
        thread_events = thread.get_events(True)
        pairs = []
        for i in range(len(thread_events)):
            for j in range(len(thread_events[i+1:])):
                pairs.append((thread_events[i].get_name(), thread_events[i+j+1].get_name()))
        
        pairs = [("(%s, %s)" % (x,y)) for x,y in pairs]
        return "ASSERT %s.PO = {%s};" % (thread.get_name(), ", ".join(pairs))
    
    def __print_agent_order(self, program):
        ao = [x.get_name()+".PO" for x in program.get_threads()]
        ret = "ASSERT AO = %s;" % (" | ".join(ao))

        return ret

    def __print_event_set(self, program):
        events = []
        rom_events = []
        wom_events = []
        for thread in program.get_threads():
            events += [x for x in thread.get_events(True)]

        rom_events = [x.get_name() for x in events if x.is_read_or_modify()]
        wom_events = [x.get_name() for x in events if x.is_write_or_modify()]
        events = [x.get_name() for x in events]

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
            if type(event.get_address()[0]) == int:
                sizes.append(event.get_address()[-1])
            else:
                sizes.append(event.get_address()[-1][-1])

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

                rset = read.get_address()
                rset = set(rset) if type(rset[0]) == int else set([y for x in rset for y in x])
                wset = write.get_address()
                wset = set(wset) if type(wset[0]) == int else set([y for x in wset for y in x])

                inters = list(set(rset) & set(wset))
                        
                if (len(inters) > 0) and (read.get_block() == write.get_block()):
                    compat_events.append("(%s, %s)"%(read.get_name(), write.get_name()))
                for inter in inters:
                    compat_bytes_events.append("((%s, %s), Int(%s))"%(read.get_name(), write.get_name(), inter))

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
        for interp in interps.get_executions():
            ret.add(self.print_execution(program, interp))

        return list(ret)
    
    def print_execution(self, program, interp):
        reads = []
        for el in interp.get_reads_values():
            value = el.get_correct_value()
            if el.get_tear() == WTEAR:
                if (self.float_pri_js%value) == "-0.00":
                    value = 0
                reads.append(("%s: "+self.float_pri_js)%(el.get_name(), value))
            else:
                reads.append("%s: %s"%(el.get_name(), value))
        return ";".join(reads)

    def __print_relation(self, relation):
        tuples = relation.get_tuples()
        return "%s = {%s}"%(relation.get_name(), ", ".join([self.__print_tuple(x) for x in tuples]))

    def __print_tuple(self, tup):
        return "(%s)"%(",".join([str(x) for x in tup]))
    
    def print_program(self, program):
        program.sort_threads()
        
        ret = ""
        ret += "if (this.Worker) {\n"
        ret += "(function execution() {\n"

        for thread in program.get_threads():
            if thread.get_name() == MAIN:
                continue
            ret += "var %s =\n"%thread.get_name()
            ret += "`onmessage = function(data) {\n"
            for ev in thread.get_events(False):
                if isinstance(ev, For_Loop):
                    ret += self.print_floop(ev)
                else:
                    ret += self.print_event(ev)

            ret += "};`;\n"


        ret += "var data = {\n"
        for sab in program.get_blocks():
            size = sab.get_size()
            if (size % 8) != 0:
                size = (int(size / 8)+1) * 8
            ret += "%s_sab : new SharedArrayBuffer(%s),\n"%(sab.get_name(), size)
        ret += "}\n"

        for thread in program.get_threads():
            if thread.get_name() != MAIN:
                continue
            for ev in thread.get_events(True):
                ret += self.print_event(ev)


        for thread in program.get_threads():
            if thread.get_name() == MAIN:
                continue
            ret += "var w%s = new Worker(%s);\n"%(thread.get_name(), thread.get_name())


        block_pars = ", ".join(["data.%s_sab"%str(x) for x in program.get_blocks()])
        for thread in program.get_threads():
            if thread.get_name() == MAIN:
                continue
            
            ret += "w%s.postMessage(data, [%s]);\n"%(thread.get_name(), block_pars)

        ret += "})();\n"
        ret += "}\n"

        return ret

    def print_floop(self, floop):
        ret = ""
        ret += "for(%s = %s; %s <= %s; %s++){\n"%(floop.get_cname(), \
                                                 floop.get_fromind(), \
                                                 floop.get_cname(), \
                                                 floop.get_toind(),
                                                 floop.get_cname())
        for ev in floop.get_events():
            ret += self.print_event(ev, floop.get_cname())

        ret += "}\n"

        return ret
    
    def print_event(self, event, postfix=None):
        operation = event.get_operation()
        ordering = event.get_ordering()
        block_name = event.get_block().get_name()
        event_name = event.get_name()
        event_address = event.get_address()
        tear = event.get_tear()
        block_size = event.get_size()
        is_float = tear == WTEAR
        var_def = ""
        
        if (ordering != INIT):
            if is_float:
                var_def = "var %s = new Float%sArray(data.%s);"%(block_name, \
                                                                  block_size*8, \
                                                                  block_name+"_sab")
            else:
                var_def = "var %s = new Int%sArray(data.%s);"%(block_name, \
                                                           block_size*8, \
                                                           block_name+"_sab")

        if (operation == WRITE) and (ordering == INIT):
            operation = ""


        if (ordering == SC) and not is_float:
            if not event_address:
                addr = event.get_offset()
                event_values = event.get_value()
            else:
                addr = event_address[0]/block_size
                event_values = event.get_correct_value()

            if operation == WRITE:
                operation = "Atomics.store(%s, %s, %s);"%(block_name, \
                                                        addr, \
                                                        event_values)


            if operation == READ:
                operation = "%s = Atomics.load(%s, %s);"%(event_name, \
                                                          block_name, \
                                                          addr)
                if postfix:
                    operation += " print(\"%s_\"+%s+\": \"+%s);"%(event_name, postfix, event_name)
                else:
                    operation += " print(\"%s: \"+%s);"%(event_name, event_name)

        if (ordering == UNORD) or is_float:
            if not event_address:
                addr = event.get_offset()
                event_values = event.get_value()
            else:
                addr = event_address[0]/block_size
                event_values = event.get_correct_value()
                    
            if operation == WRITE:
                if is_float:
                    event_values = self.float_pri_js%event_values

                operation = ("%s[%s] = %s;")%(block_name, \
                                              addr, \
                                              event_values)

            if operation == READ:
                approx = self.float_app_js if is_float else ""
                    
                operation = "%s = %s[%s];"%(event_name, \
                                            block_name, \
                                            addr)

                if postfix:
                    operation += " print(\"%s_\"+%s+\": \"+%s%s);"%(event_name, postfix, event_name, approx)
                else:
                    operation += " print(\"%s: \"+%s%s);"%(event_name, event_name, approx)
            

        return var_def+" "+operation+"\n"


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
    

class DotPrinter():
    NAME = "DOT"
    TYPE = PrinterType.GRAPH

    def __init__(self):
        pass

    def print_executions(self, program, interps):
        graphs = []
        for interp in interps.get_executions():
            graphs.append(self.print_execution(program, interp))
        return graphs

    def print_execution(self, program, interp):
        ret = []
        ret.append("digraph memory_model {")
        ret.append("rankdir=LR;")
        
        color = "red"
        for tup in interp.get_RBF().get_tuples():
            label = "%s[%s]"%(interp.get_RBF().get_name(), tup[2])
            ret.append("%s -> %s [label = \"%s\", color=\"%s\"];" % (tup[0], tup[1], label, color))

        for tup in interp.get_RF().get_tuples():
            label = interp.get_RF().get_name()
            ret.append("%s -> %s [label = \"%s\", color=\"%s\"];" % (tup[0], tup[1], label, color))
        
        relations = []
        relations.append(interp.get_HB())
        relations.append(interp.get_MO())
        relations.append(interp.get_SW())

        color = "black"
        for relation in relations:
            label = relation.get_name()
            for tup in relation.get_tuples():
                ret.append("%s -> %s [label = \"%s\", color=\"%s\"];" % (tup[0], tup[1], label, color))
        
        ret.append("}")
                
        return "\n".join(ret)
    
    def print_program(self, program):
        pass
    
    def print_event(self, event):
        pass
    
    

class BePrinter():
    NAME = "BE"
    TYPE = PrinterType.BEXEC

    float_pri_js = "%.2f"
    
    def __init__(self):
        pass

    def print_execution(self, program, interp):
        return self.print_program(program)
    
    def print_program(self, program):
        program.sort_threads()
        ret = ""

        blocks = [x.name for x in program.get_blocks()]
        blocks.sort()
        for sab in blocks:
            ret += "var %s = new SharedArrayBuffer();\n"%(sab)

        for thread in program.get_threads():
            if thread.get_name() != MAIN:
                continue
            for ev in thread.get_events(True):
                ret += self.print_event(ev)

        for thread in program.get_threads():
            if thread.get_name() == MAIN:
                continue
            ret += "Thread %s {\n"%(thread.get_name())
            for ev in thread.get_events(False):
                if isinstance(ev, For_Loop):
                    ret += self.print_floop(ev)
                else:
                    ret += self.print_event(ev)

            ret += "}\n"
                
        return ret

    def print_event(self, event, postfix=None):
        operation = event.get_operation()
        ordering = event.get_ordering()
        block_name = event.get_block().get_name()
        event_name = event.get_name()
        event_address = event.get_address()
        tear = event.get_tear()
        block_size = event.get_size()
        is_float = tear == WTEAR
        
        if (ordering == INIT):
            return ""
        
        if (operation == WRITE) and (ordering == INIT):
            operation = ""


        if (ordering == SC) and not is_float:
            if not event_address:
                addr = event.get_offset()
                event_values = event.get_value()
            else:
                addr = event_address[0]/block_size
                event_values = event.get_correct_value()

            if operation == WRITE:
                operation = "Atomics.store(%s%s, %s, %s);"%(block_name, \
                                                            self.__get_block_size(block_size, False), \
                                                            addr, \
                                                            event_values)


            if operation == READ:
                operation = "print(Atomics.load(%s%s, %s));"%(block_name, \
                                                        self.__get_block_size(block_size, False), \
                                                        addr)

        if (ordering == UNORD) or is_float:
            if not event_address:
                addr = event.get_offset()
                event_values = event.get_value()
            else:
                addr = event_address[0]/block_size
                event_values = event.get_correct_value()

            if operation == WRITE:
                if is_float:
                    event_values = self.float_pri_js%event_values
                    event_values = re.sub("0+\Z","", event_values)
                
                operation = ("%s%s[%s] = %s;")%(block_name, \
                                                self.__get_block_size(block_size, is_float),\
                                                addr, \
                                                event_values)

            if operation == READ:
                operation = "print(%s%s[%s]);"%(block_name, \
                                                self.__get_block_size(block_size, is_float),\
                                                addr)            

        return operation+"\n"


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
        ret += "for(%s = %s..%s) {\n"%(floop.get_cname(), \
                                    floop.get_fromind(), \
                                    floop.get_toind())
        for ev in floop.get_events():
            ret += self.print_event(ev, floop.get_cname())

        ret += "}\n"

        return ret
    
    
    
