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

from ecmasab.execution import RELATIONS, BLOCKING_RELATIONS, For_Loop, ITE_Statement, Memory_Event
from ecmasab.execution import READ, WRITE, INIT, SC, UNORD, MAIN, TYPE
from ecmasab.beparsing import T_INT8, T_INT16, T_INT32, T_FLO32, T_FLO64, T_DONE, T_VAL, T_OPE
from ecmasab.exceptions import UnreachableCodeException

LICENSE = ""
LICENSE += "// Copyright 2017 Cristian Mattarei\n"
LICENSE += "//\n"
LICENSE += "// Licensed under the modified BSD (3-clause BSD) License.\n"
LICENSE += "//\n"
LICENSE += "// Unless required by applicable law or agreed to in writing, software\n"
LICENSE += "// distributed under the License is distributed on an \"AS IS\" BASIS,\n"
LICENSE += "// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n"
LICENSE += "// See the License for the specific language governing permissions and\n"
LICENSE += "// limitations under the License.\n\n"


FLOAT_APPROX = 4

def float_approx(value, approx=FLOAT_APPROX):
    val = value*(10**approx)
    if (value*(10**approx)) % 1 >= float(0.5):
        val += 1
    return float(float(int(val))/(10**approx))

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
        PrintersFactory.register_printer(JST262Printer())
        PrintersFactory.register_printer(JST262_NP_Printer())
        PrintersFactory.register_printer(JST262_NA_Printer())
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
    DESC = "MISSING DESCRIPTION!"
    TYPE = PrinterType.JS

    OUT = "//output// "
    
    float_app_js = ".toFixed("+str(FLOAT_APPROX)+")"
    float_pri_js = "%."+str(FLOAT_APPROX)+"f"
    
    def __init__(self):
        pass

    def print_executions(self, program, interps):
        return "\n".join(self.compute_possible_executions(program, interps))

    def compute_possible_executions(self, program, interps):
        ret = set([])
        for interp in interps.get_coherent_executions():
            ret.add(self.print_execution(program, interp))

        return list(ret)
    
    def print_execution(self, program, interp):
        pass
    
    def print_program(self, program, executions=None):
        pass
    
    def print_event(self, event, postfix=None):
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

    def print_done(self):
        return T_DONE
    
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
    DESC = "Google V8 format"

    def print_execution(self, program, interp):
        reads = []
        for el in interp.reads_values:
            value = el.get_correct_read_value()
            if el.is_wtear():
                if (self.float_pri_js%value) == "-0.00":
                    value = 0
                reads.append(("%s: "+self.float_pri_js)%(el.name, float_approx(value)))
            else:
                reads.append("%s: %s"%(el.name, value))
        ret = ";".join(reads)
        ret = ret.replace("nan", "NaN")
        return ret
    
    def print_program(self, program, executions=None):
        program.sort_threads()
        
        ret = LICENSE
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

        if executions:
            execs = self.compute_possible_executions(program, executions)
            execs = ["%s%s"%(self.OUT, x) for x in execs]
            ret += "\n// Expected outputs //\n%s\n"%"\n".join(execs)
        
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
            for ind in [0,2]:
                if isinstance(cond[ind], Memory_Event):
                    ret += self.print_event(cond[ind])

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
        is_float = event.is_wtear()
        var_def = ""
        prt = ""
        
        if (event.ordering != INIT):
            if is_float:
                var_def = "var %s = new Float%sArray(data.%s)"%(event.block.name, \
                                                                event.get_size()*8, \
                                                                event.block.name+"_sab")
            else:
                var_def = "var %s = new Int%sArray(data.%s)"%(event.block.name, \
                                                              event.get_size()*8, \
                                                              event.block.name+"_sab")

        if (event.operation == WRITE) and (event.ordering == INIT):
            return var_def+"\n"

        if (event.operation == WRITE):
            if event.value_is_number():
                event_values = event.get_correct_value()
            else:
                event_values = "".join(event.value)

        if (event.ordering == SC) and not is_float:
            if not event.address:
                addr = event.offset
            else:
                addr = int(event.address[0]/event.get_size())

            if event.operation == WRITE:
                mop = "Atomics.store(%s, %s, %s)"%(event.block.name, \
                                                   addr, \
                                                   event_values)

            if event.operation == READ:
                mop = "%s = Atomics.load(%s, %s)"%(event.name, \
                                                   event.block.name, \
                                                   addr)
                if postfix:
                    prt = "print(\"%s_\"+%s+\": \"+%s)"%(event.name, postfix, event.name)
                else:
                    prt = "print(\"%s: \"+%s)"%(event.name, event.name)

        if (event.ordering == UNORD) or is_float:
            if not event.address:
                addr = event.offset
            else:
                addr = int(event.address[0]/event.get_size())
                    
            if event.operation == WRITE:
                if is_float and event.address:
                    event_values = self.float_pri_js%(float_approx(event_values))

                mop = ("%s[%s] = %s")%(event.block.name, \
                                       addr, \
                                       event_values)

            if event.operation == READ:
                approx = self.float_app_js if is_float else ""
                    
                mop = "%s = %s[%s]"%(event.name, \
                                     event.block.name, \
                                     addr)

                if postfix:
                    prt = "print(\"%s_\"+%s+\": \"+%s%s)"%(event.name, postfix, event.name, approx)
                else:
                    prt = "print(\"%s: \"+%s%s)"%(event.name, event.name, approx)

        if event.operation == READ:
            return "%s;\n"%("; ".join([var_def,mop,prt]))
        else:
            return "%s;\n"%("; ".join([var_def,mop]))


class JST262Printer(JSPrinter):
    NAME = "JS-TEST262"
    DESC = "TEST262 format"

    waiting_time = 0
    agent_prefix = "$262"

    asserts = True
    indent = "   "

    def print_execution(self, program, interp):
        reads = []
        for el in interp.reads_values:
            value = el.get_correct_read_value()
            if el.is_wtear():
                if (self.float_pri_js%value) == "-0.00":
                    value = 0
                reads.append(("%s: "+self.float_pri_js)%(el.name, float_approx(value)))
            else:
                reads.append("%s: %s"%(el.name, value))
        ret = ";".join(reads)
        ret = ret.replace("nan", "NaN")
        return ret
    
    def print_program(self, program, executions=None):
        program.sort_threads()

        ind = self.indent
        
        ret = LICENSE

        for thread in program.threads:
            if thread.name == MAIN:
                continue
            ret += "\n// Thread %s\n"%thread.name
            ret += "%s.agent.start(\n"%self.agent_prefix
            ret += (ind*1)+"`%s.agent.receiveBroadcast(function (data) {\n"%self.agent_prefix
            ret += (ind*2)+"var report = [];\n"

            for ev in thread.get_events(False):
                if isinstance(ev, For_Loop):
                    ret += self.print_floop(ev)
                elif isinstance(ev, ITE_Statement):
                    ret += self.print_ite(ev)
                else:
                    ret += (ind*2)+self.print_event(ev)

            ret += (ind*2)+"%s.agent.report(report);\n"%self.agent_prefix
            ret += (ind*2)+"%s.agent.leaving();\n"%self.agent_prefix
            ret += (ind*1)+"})\n"
            ret += (ind*1)+"`);\n"

        blocks = [(x.name, x.size) for x in program.get_blocks()]
        blocks.sort()
        ret += "\nvar data = {\n"
        for sab in blocks:
            size = sab[1]
            if (size % 8) != 0:
                size = (int(size / 8)+1) * 8
            ret += (ind*1)+"%s_sab : new SharedArrayBuffer(%s),\n"%(sab[0], size)
        ret += "}\n"

        ret += "%s.agent.broadcast(data);\n"%self.agent_prefix
        ret += "var report = [];\n"
        
        ret += "\n// MAIN Thread\n"
        for thread in program.threads:
            if thread.name != MAIN:
                continue
            for ev in thread.get_events(True):
                ret += self.print_event(ev)

        ret += "\n"
        if self.waiting_time > 0:
            ret += "%s.agent.sleep(%s);\n"%(self.agent_prefix, self.waiting_time)
        ret += "var thread_report;\n"
        ret += "var reports = 0;\n"
        ret += "var i = 0;\n"
        ret += "while (true) {\n"
        ret += (ind*1)+"thread_report = %s.agent.getReport();\n"%self.agent_prefix
        ret += (ind*1)+"if (thread_report != null) {\n"
        ret += (ind*2)+"for(i=0; i < thread_report.length; i++){\n"
        ret += (ind*3)+"report.push(thread_report[i]);\n"
        ret += (ind*3)+"print(thread_report[i]);\n"
        ret += (ind*2)+"}\n"
        ret += (ind*2)+"reports += 1;\n"
        ret += (ind*2)+"if (reports >= %s) break;\n"%(len(program.threads)-1)
        ret += (ind*1)+"}\n"
        ret += "}\n\n"
        
        if self.asserts and executions:
            ret += "report.sort();\n"
            ret += "report = report.join(\";\");\n"

            ret += "var outputs = [];\n"
            i = 0
            for ex_out in self.compute_possible_executions(program, executions):
                ret += "outputs[%s] = \"%s\";\n"%(i, ex_out)
                i += 1

            ret += "assert(-1 != outputs.indexOf(report));\n"

        if executions:
            execs = self.compute_possible_executions(program, executions)
            execs = ["%s%s"%(self.OUT, x) for x in execs]
            ret += "\n// Expected outputs //\n%s\n"%"\n".join(execs)
            
        return ret

    def print_floop(self, floop):
        ind = self.indent
        ret = ""
        ret += (ind*2)+"for(%s = %s; %s <= %s; %s++){\n"%(floop.cname, \
                                                          floop.fromind, \
                                                          floop.cname, \
                                                          floop.toind,
                                                          floop.cname)
        for ev in floop.events:
            ret += (ind*3)+self.print_event(ev, floop.cname)

        ret += (ind*2)+"}\n"

        return ret

    def print_ite(self, ite):
        ind = self.indent
        ret = ""

        for cond in ite.conditions:
            for i in [0,2]:
                if isinstance(cond[i], Memory_Event):
                    ret += (ind*2)+self.print_event(cond[i])

        conditions = ["%s %s %s"%x for x in ite.conditions]
        ret += (ind*2)+"if(%s) {\n"%(" AND ".join(conditions))

        for ev in ite.then_events:
            ret += (ind*3)+self.print_event(ev)

        ret += (ind*2)+"} else {\n"
            
        for ev in ite.else_events:
            ret += (ind*3)+self.print_event(ev)
            
        ret += (ind*2)+"}\n"

        return ret
    
    def print_event(self, event, postfix=None):
        is_float = event.is_wtear()
        var_def = ""
        prt = ""
        mop = None
        
        if (event.operation == WRITE) and (event.ordering == INIT):
            return ""
        
        if (event.ordering != INIT):
            if is_float:
                var_def = "var %s = new Float%sArray(data.%s)"%(event.block.name, \
                                                                event.get_size()*8, \
                                                                event.block.name+"_sab")
            else:
                var_def = "var %s = new Int%sArray(data.%s)"%(event.block.name, \
                                                              event.get_size()*8, \
                                                              event.block.name+"_sab")

        if (event.is_write_or_modify()):
            if event.value_is_number():
                event_values = event.get_correct_value()
            else:
                event_values = "".join(event.value)

        if (event.ordering == SC) and not is_float:
            if not event.address:
                addr = event.offset
            else:
                addr = int(event.address[0]/event.get_size())

            if event.is_write():
                mop = "Atomics.store(%s, %s, %s)"%(event.block.name, \
                                                   addr, \
                                                   event_values)

            if event.is_read():
                mop = "%s = Atomics.load(%s, %s)"%(event.name, \
                                                   event.block.name, \
                                                   addr)
                if postfix:
                    prt = "report.push(\"%s_\"+%s+\": \"+%s)"%(event.name, postfix, event.name)
                else:
                    prt = "report.push(\"%s: \"+%s)"%(event.name, event.name)

            if event.is_modify():
                operator = None
                
                if event.is_add():
                    operator = "Atomics.add"
                elif event.is_sub():
                    operator = "Atomics.sub"
                elif event.is_and():
                    operator = "Atomics.and"
                elif event.is_xor():
                    operator = "Atomics.xor"
                elif event.is_or():
                    operator = "Atomics.or"
                elif event.is_exchange():
                    operator = "Atomics.exchange"
                else:
                    raise UnreachableCodeException("Operator not supported")

                mop = "%s = %s(%s, %s, %s)"%(event.name, \
                                             operator, \
                                             event.block.name, \
                                             addr, \
                                             event_values)
                
                if postfix:
                    prt = "report.push(\"%s_\"+%s+\": \"+%s)"%(event.name, postfix, event.name)
                else:
                    prt = "report.push(\"%s: \"+%s)"%(event.name, event.name)
                    
        if (event.ordering == UNORD) or is_float:
            if not event.address:
                addr = event.offset
            else:
                addr = int(event.address[0]/event.get_size())
                    
            if event.operation == WRITE:
                if is_float and event.address:
                    event_values = self.float_pri_js%(float_approx(event_values))

                mop = ("%s[%s] = %s")%(event.block.name, \
                                       addr, \
                                       event_values)
                
            if event.operation == READ:
                approx = self.float_app_js if is_float else ""
                    
                mop = "%s = %s[%s]"%(event.name, \
                                     event.block.name, \
                                     addr)

                if postfix:
                    prt = "report.push(\"%s_\"+%s+\": \"+%s%s)"%(event.name, postfix, event.name, approx)
                else:
                    prt = "report.push(\"%s: \"+%s%s)"%(event.name, event.name, approx)

        assert mop
        
        if event.is_read_or_modify():
            return "%s;\n"%("; ".join([var_def,mop,prt]))
        else:
            if not mop:
                return var_def+"\n"
            return "%s;\n"%("; ".join([var_def,mop]))
    

class JST262_NP_Printer(JST262Printer):
    NAME = "JS-TEST262-NP"
    DESC = "TEST262 format (without $262 prefix)"

    agent_prefix = "$"

class JST262_NA_Printer(JST262Printer):
    NAME = "JS-TEST262-NA"
    DESC = "TEST262 format (without assertions)"

    asserts = False

class DotPrinter(object):
    NAME = "DOT"
    TYPE = PrinterType.GRAPH
    float_pri_js = "%."+str(FLOAT_APPROX)+"f"
    printing_relations = None
    sepx = 3
    sepy = 2
        
    def __init__(self):
        self.printing_relations = []

    def print_executions(self, program, interps):
        graphs = []
        for interp in interps.get_coherent_executions():
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
                
        iposx = ((len(program.threads)-2)*self.sepx)/2.0
        posx = iposx
        maxy = max([len(x.get_events(True)) for x in program.threads])*self.sepy
        posy = maxy
        
        for thread in program.threads:
            if thread.name == MAIN:
                for event in thread.get_events(True):
                    node = self.__print_event(event, reads_dic, posx, posy)
                    ret.append(node)
                    posy -= self.sepy

        posx = 0
        sposy = posy
                    
        for thread in program.threads:
            posy  = sposy
            if thread.name != MAIN:
                for event in thread.get_events(True):
                    node = self.__print_event(event, reads_dic, posx, posy)
                    ret.append(node)
                    posy -= self.sepy
                posx += self.sepx

        mo_str = "<br align=\"left\"/>".join(self.__print_memory_order(interp))
        ret.append("MO [label=<<B>Memory Order</B><br/>%s<br align=\"left\"/>>, splines=false, overlap=true, margin=0, shape=none, pos=\"%d,%d!\"]"%(mo_str, iposx+self.sepx, maxy))
        
        ret.append("}")
                
        return ("\n".join(ret))+"\n"

    def __print_memory_order(self, interp):
        mo = interp.get_MO()
        events = {}
        for tup in mo.tuples:
            if not tup[0] in events: events[tup[0]] = 0
            if not tup[1] in events: events[tup[1]] = 0
            events[tup[0]] += 1

        events = [(events[x], x) for x in events]
        events.sort()
        events.reverse()
        events = ["%s: %s"%(len(events)-x[0], x[1]) for x in events]
        return events
    
    def __print_event(self, event, reads_dic, posx, posy):
        revent = event
        if event.name in reads_dic:
            revent = reads_dic[event.name]
            value = revent.get_correct_read_value()
            bname = "%s%s[%s]"%(revent.block.name, self.__get_block_size(revent), revent.address[0])
        else:
            if revent.is_init():
                value = 0
                bname = "%s-init"%revent.block.name
            else:
                value = revent.get_correct_write_value()
                bname = "%s%s[%s]"%(revent.block.name, self.__get_block_size(revent), revent.address[0])
            
        value = self.float_pri_js%(float_approx(value)) if revent.is_wtear() else value

        if revent.is_read():
            oper = "= %s"%value
        elif revent.is_write():
            oper = ":= %s"%value
        else:
            wvalue = event.get_correct_write_value()
            simbop = None
            if revent.is_add():
                simbop = "+="
            elif revent.is_sub():
                simbop = "-="
            elif revent.is_and():
                simbop = "&amp;="
            elif revent.is_xor():
                simbop = "^="
            elif revent.is_or():
                simbop = "|="
            elif revent.is_exchange():
                simbop = ":="
            else:
                raise UnreachableCodeException("Operator not supported")

            oper = "%s %s<br/>(%s &rarr; %s)"%(simbop, wvalue, value, revent.get_operator_fun()(value, wvalue))

        atomic = "A." if event.is_atomic() else ""                
        label = "%s<br/><B>%s%s %s</B>"%(revent.name, atomic, bname, oper)
        if revent.has_info(ITE_Statement.OP_ITE):
            label +=  "<br/>(%s)"%revent.info[ITE_Statement.OP_ITE]
        
        node = "%s [label=<%s>, shape=box, style=rounded, pos=\"%s,%s!\"]"%(revent.name, label, posx, posy)

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

        if  program.params:
            ret += "Params {\n"
            ret += self.print_params(program.params)
            ret += "\n}\n"
            
        return ret

    def print_event(self, event, pure=False):
        is_float = event.is_wtear()

        if (event.ordering == INIT):
            return ""
        
        if (event.ordering == SC) and not is_float:
            if not event.address:
                addr = event.offset
                event_values = []
                event_values = "".join(self.__solve_param_names(event.value))
            else:
                addr = int(event.address[0]/event.get_size())
                event_values = event.get_correct_value()
                if not event_values and event.value:
                    event_values = "".join(self.__solve_param_names(event.value))

            if event.is_write():
                ret = "Atomics.store(%s%s, %s, %s)"%(event.block.name, \
                                                     self.__get_block_size(event.get_size(), False), \
                                                     addr, \
                                                     event_values)

            if event.is_read():
                ret = "Atomics.load(%s%s, %s)"%(event.block.name, \
                                                self.__get_block_size(event.get_size(), False), \
                                                addr)

            if event.is_modify():
                operator = None
                if event.is_add():
                    operator = "Atomics.add"
                elif event.is_sub():
                    operator = "Atomics.sub"
                elif event.is_and():
                    operator = "Atomics.and"
                elif event.is_xor():
                    operator = "Atomics.xor"
                elif event.is_or():
                    operator = "Atomics.or"
                elif event.is_exchange():
                    operator = "Atomics.exchange"
                else:
                    raise UnreachableCodeException("Operator not supported")

                ret = "%s(%s%s, %s, %s)"%(operator, \
                                          event.block.name, \
                                          self.__get_block_size(event.get_size(), False), \
                                          addr, \
                                          event_values)
                    
        if (event.ordering == UNORD) or is_float:
            if not event.address:
                addr = event.offset
                event_values = []
                event_values = "".join(self.__solve_param_names(event.value))
            else:
                addr = int(event.address[0]/event.get_size())
                event_values = event.get_correct_value()
                if not event_values and event.value:
                    event_values = "".join(self.__solve_param_names(event.value))

            if event.operation == WRITE:
                if is_float and event.address:
                    if type(event_values) == list:
                        event_values = "".join(event_values)
                    else:
                        event_values = self.__get_round_value(event_values)

                ret = ("%s%s[%s] = %s")%(event.block.name, \
                                         self.__get_block_size(event.get_size(), is_float),\
                                         addr, \
                                         event_values)

            if event.operation == READ:
                ret = "%s%s[%s]"%(event.block.name, \
                                  self.__get_block_size(event.get_size(), is_float),\
                                  addr)            

        if not pure:
            if event.is_read_or_modify():
                ret = "print(%s);\n"%ret
            else:
                ret = "%s;\n"%ret
                
        return ret

    def __solve_param_names(self, value):
        if type(value) != list:
            return value
        ret = []
        for i in range(len(value)):
            if (T_VAL in value[i]) or (T_OPE in value[i]):
                ret.append("<%s>"%value[i])
            else:
                ret.append(value[i])

        return ret
    
    def __get_round_value(self, value):
        if type(value) == int:
            return value

        if type(value) == str:
            return value
        
        if type(value) == list:
            return "".join(value)

        values = self.float_pri_js%(float_approx(value))
        val1 = int(re.search("[0-9]+\.", values).group(0)[:-1])
        val2 = re.search("\.[0-9]+", values).group(0)
        val2 = re.sub("0+\Z", "", val2)[1:]
        val2 = int(val2) if val2 != "" else 0
        return "%s.%s"%(val1,val2)
    
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

        conditions = []
        for cond in ite.conditions:
            lft = None
            rgt = None
            if isinstance(cond[0], Memory_Event):
                lft = self.print_event(cond[0], True)
            else:
                lft = cond[0]
            if isinstance(cond[2], Memory_Event):
                rgt = self.print_event(cond[2], True)
            else:
                rgt = cond[2]

            con = self.__solve_param_names([lft, cond[1], rgt])
            conditions.append("%s %s %s"%(con[0],con[1],con[2]))

        ret += "if(%s) {\n"%(" AND ".join(conditions))
        
        for ev in ite.then_events:
            ret += self.print_event(ev)

        ret += "} else {\n"
            
        for ev in ite.else_events:
            ret += self.print_event(ev)
            
        ret += "}\n"

        return ret
    
    def print_params(self, params):
        ret = []
        for el in params:
            ret.append("%s = [%s];"%(el, ",".join([str(self.__get_round_value(x)) for x in params[el]])))

        return "\n".join(ret)
