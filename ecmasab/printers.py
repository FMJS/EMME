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
import json
from six.moves import range

from ecmasab.execution import RELATIONS, For_Loop, ITE_Statement, Memory_Event, Thread, Program, Block
from ecmasab.execution import READ, WRITE, INIT, SC, UNORD, MAIN
from ecmasab.parsing import T_INT8, T_INT16, T_INT32, T_FLO32, T_FLO64, T_VAL, T_OPE
from ecmasab.exceptions import UnreachableCodeException
from ecmasab.utils import compress_string

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

ASMACCESS = ""
ASMACCESS += "let asm_memacc = `(function Module(stdlib, foreign, heap) {\n"
ASMACCESS += "  \"use asm\";\n"
ASMACCESS += "  var MEM8 = new stdlib.Int8Array(heap);\n"
ASMACCESS += "  var MEM16 = new stdlib.Int16Array(heap);\n"
ASMACCESS += "  var MEM32 = new stdlib.Int32Array(heap);\n"
ASMACCESS += "  var MEMU8 = new stdlib.Uint8Array(heap);\n"
ASMACCESS += "  var MEMU16 = new stdlib.Uint16Array(heap);\n"
ASMACCESS += "  var MEMU32 = new stdlib.Uint32Array(heap);\n"
ASMACCESS += "  function load8(x) { x = x | 0; return MEM8[x] | 0; }\n"
ASMACCESS += "  function loadu8(x) { x = x | 0; return MEMU8[x] | 0; }\n"
ASMACCESS += "  function load16(x) { x = x | 0; return MEM16[x >> 1] | 0; }\n"
ASMACCESS += "  function loadu16(x) { x = x | 0; return MEMU16[x >> 1] | 0; }\n"
ASMACCESS += "  function load32(x) { x = x | 0; return MEM32[x >> 2] | 0; }\n"
ASMACCESS += "  function loadu32(x) { x = x | 0; return MEMU32[x >> 2] | 0; }\n"
ASMACCESS += "  function store8(x, v) { x = x | 0; v = v | 0; MEM8[x] = v; }\n"
ASMACCESS += "  function storeu8(x, v) { x = x | 0; v = v | 0; MEMU8[x] = v; }\n"
ASMACCESS += "  function store16(x, v) { x = x | 0; v = v | 0; MEM16[x >> 1] = v; }\n"
ASMACCESS += "  function storeu16(x, v) { x = x | 0; v = v | 0; MEMU16[x >> 1] = v; }\n"
ASMACCESS += "  function store32(x, v) { x = x | 0; v = v | 0; MEM32[x >> 2] = v; }\n"
ASMACCESS += "  function storeu32(x, v) { x = x | 0; v = v | 0; MEMU32[x >> 2] = v; }\n"
ASMACCESS += "  return {\n"
ASMACCESS += "    load8: load8,\n"
ASMACCESS += "    loadu8: loadu8,\n"
ASMACCESS += "    load16: load16,\n"
ASMACCESS += "    loadu16: loadu16,\n"
ASMACCESS += "    load32: load32,\n"
ASMACCESS += "    loadu32: loadu32,\n"
ASMACCESS += "    store8: store8,\n"
ASMACCESS += "    storeu8: storeu8,\n"
ASMACCESS += "    store16: store16,\n"
ASMACCESS += "    storeu16: storeu16,\n"
ASMACCESS += "    store32: store32,\n"
ASMACCESS += "    storeu32: storeu32,\n"
ASMACCESS += "  };\n"
ASMACCESS += "})`;\n"

def float_approx(value, approx=FLOAT_APPROX):
    val = value*(10**approx)
    if (value*(10**approx)) % 1 >= float(0.5):
        val += 1
    return float(float(int(val))/(10**approx))

class NotRegisteredPrinterException(Exception):
    pass

class PrinterType(object):
    c_size = 10
    ####################

    SMT = 0

    ENCODERS = 10
    ####################
    
    JS = 11
    BEXEC = 12
    JSON = 13

    PROGRAMS = 20
    ####################
    
    GRAPH = 21
    
class PrintersFactory(object):
    printers = []

    # Additional printers should be registered here #
    @staticmethod
    def init_printers():
        PrintersFactory.register_printer(JST262_Printer())
        
        PrintersFactory.register_printer(JST262_V8_Printer())
        PrintersFactory.register_printer(JST262_SM_Printer())
        PrintersFactory.register_printer(JST262_JSC_Printer())
        
        PrintersFactory.register_printer(JSV8Printer())

        PrintersFactory.register_printer(JST262_WASM_V8_Printer())
        PrintersFactory.register_printer(JST262_WASM_JSC_Printer())

        PrintersFactory.register_printer(DotPrinter())
        PrintersFactory.register_printer(BePrinter())
        PrintersFactory.register_printer(JSONPrinter())
    
    @staticmethod
    def register_printer(printer):
        if printer.NAME not in dict(PrintersFactory.printers):
            PrintersFactory.printers.append((printer.NAME, printer))

    @staticmethod    
    def printer_by_name(name):
        PrintersFactory.init_printers()
        dprint = dict(PrintersFactory.printers)
        if name not in dprint:
            raise NotRegisteredPrinterException
        return dprint[name]

    @staticmethod    
    def get_printers():
        PrintersFactory.init_printers()
        return [x[0] for x in PrintersFactory.printers]

    @staticmethod    
    def get_printers_by_type(printertype):
        PrintersFactory.init_printers()
        if (printertype % PrinterType.c_size) == 0:
            return [x[1] for x in PrintersFactory.printers \
                    if (x[1].TYPE < printertype) and (x[1].TYPE >= printertype-PrinterType.c_size)]
        
        return [x[1] for x in PrintersFactory.printers if x[1].TYPE == printertype]
    
class JSPrinter(object):
    NAME = "JS-PRINTER"
    DESC = "MISSING DESCRIPTION!"
    TYPE = PrinterType.JS
    EXT = ".js"

    DATA = "// Expected Output (Compressed Data) //"
    OUT = "//output// "
    MOD = "//model// "
    
    float_app_js = ".toFixed("+str(FLOAT_APPROX)+")"
    float_pri_js = "%."+str(FLOAT_APPROX)+"f"
    
    def __init__(self):
        pass

    def print_executions(self, program, interps):
        return "\n".join(self.compute_possible_executions(program, interps))

    def compute_possible_executions(self, program, interps, models=False):
        ret = []
        for interp in interps.get_coherent_executions():
            exe = self.print_execution(program, interp, models)
            if exe not in ret:
                ret.append(exe)

        return ret
    
    def print_execution(self, program, interp, models=False):
        pass
    
    def print_program(self, program, executions=None):
        pass
    
    def print_event(self, event, postfix=None):
        pass

    def get_extension(self):
        return self.EXT
        
class JSV8Printer(JSPrinter):
    NAME = "JS-V8"
    DESC = "\t\tGoogle V8 format"
    EXT = ".js"

    def print_execution(self, program, interp, models=False):
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
            linesize = 80
            execs = self.compute_possible_executions(program, executions, True)
            execs = ["%s%s"%(self.OUT, x) for x in execs]
            data = compress_string("\n".join(execs))
            data = [data[x:x+linesize] for x in range(0, len(data), linesize)]
            ret += "\n%s\n//%s\n"%(self.DATA, "\n//".join(data))
        
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

    def get_extension(self):
        return self.EXT

class JST262_Printer(JSPrinter):
    NAME = "JS-TEST262"
    DESC = "\tTEST262 format (Standard)"
    str_report = True
    exp_outputs = False
    or_zero = True

    waiting_time = 0
    agent_prefix = "$262"

    asserts = True
    indent = "   "

    use_asm = False
    
    def print_execution(self, program, interp, models=False):
        reads = []
        output = ""
        for el in interp.reads_values:
            value = el.get_correct_read_value()
            if el.is_wtear():
                if (self.float_pri_js%value) == "-0.00":
                    value = 0
                output = ("%s: "+self.float_pri_js)%(el.name, float_approx(value))
            else:
                output = "%s: %s"%(el.name, value)
            reads.append(output)
        ret = ";".join(reads)
        ret = ret.replace("nan", "NaN")
        if models:
            ret += "%s%s"%(self.MOD, str(interp))

        return ret
    
    def print_program(self, program, executions=None):
        program.sort_threads()

        ind = self.indent
        
        ret = LICENSE

        if self.use_asm:
            ret += ASMACCESS

        blocks = [(x.name, x.size) for x in program.get_blocks()]
        blocks.sort()

        str_blist = ",".join(["%s_sab"%x[0] for x in blocks])
        
        for thread in program.threads:
            if thread.name == MAIN:
                continue
            ret += "\n// Thread %s\n"%thread.name
            ret += "%s.agent.start(\n"%self.agent_prefix
            ret += (ind*1)+"`%s.agent.receiveBroadcast(function thread_%s(%s) {\n"%(self.agent_prefix, \
                                                                                    thread.name, \
                                                                                    str_blist if self.str_report else "data")
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

        if not self.str_report:
            ret += "\nvar data = {\n"
        for sab in blocks:
            size = sab[1]
            if (size % 8) != 0:
                size = (int(size / 8)+1) * 8
                
            if self.str_report:
                ret += "var %s_sab = new SharedArrayBuffer(%s);\n"%(sab[0], size)
            else:
                ret += (ind*1)+"%s_sab : new SharedArrayBuffer(%s),\n"%(sab[0], size)
                
        if not self.str_report:
            ret += "}\n"

        if self.str_report:
            ret += "%s.agent.broadcast(%s);\n"%(self.agent_prefix, str_blist)
        else:
            ret += "%s.agent.broadcast(data);\n"%(self.agent_prefix)

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
        if self.str_report:
            ret += (ind*2)+"thread_report = thread_report.split(\",\");\n"
        ret += (ind*2)+"for(i=0; i < thread_report.length; i++){\n"
        if self.str_report:
            ret += (ind*3)+"if(thread_report[i] == \"\") continue;\n"
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
            
            execs = self.compute_possible_executions(program, executions)
            ret += "\n".join(["outputs[%s] = \"%s\";"%(execs.index(x), x) for x in execs])
            ret += "\nassert(-1 != outputs.indexOf(report));\n"

        if executions and self.exp_outputs:
            linesize = 80
            execs = self.compute_possible_executions(program, executions, True)
            execs = ["%s%s"%(self.OUT, x) for x in execs]
            data = compress_string("\n".join(execs))
            data = [data[i:i+linesize] for i in range(0, len(data), linesize)]
            ret += "\n%s\n//%s\n"%(self.DATA, "\n//".join(data))
            
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

        if ite.else_events is not None:
            for ev in ite.else_events:
                ret += (ind*3)+self.print_event(ev)
            
        ret += (ind*2)+"}\n"

        return ret
    
    def print_event(self, event, postfix=None):
        is_float = event.is_wtear()
        var_def = None
        prt = None
        mop = None
        
        if (event.operation == WRITE) and (event.ordering == INIT):
            return ""
        
        if (event.ordering != INIT) and (not self.use_asm):
            if is_float:
                var_def = "var %s = new Float%sArray(%s%s)"%(event.block.name, \
                                                             event.get_size()*8, \
                                                             "" if self.str_report else "data.", \
                                                             event.block.name+"_sab")
            else:
                var_def = "var %s = new Int%sArray(%s%s)"%(event.block.name, \
                                                              event.get_size()*8, \
                                                              "" if self.str_report else "data.", \
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
                mop = "%s = Atomics.load(%s, %s)%s"%(event.name, \
                                                     event.block.name, \
                                                     addr,\
                                                     " | 0" if self.or_zero else "")
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

                if self.use_asm and not is_float:
                    mop = ("(${asm_memacc}(this, {}, %s%s_sab)).store%s(%s, %s)")%("" if self.str_report else "data.", \
                                                                                   event.block.name, \
                                                                                   event.get_size()*8, \
                                                                                   addr, \
                                                                                   event_values)
                else:
                    mop = ("%s[%s] = %s")%(event.block.name, \
                                           addr, \
                                           event_values)
                    
            if event.operation == READ:
                approx = self.float_app_js if is_float else ""
                    

                if self.use_asm and not is_float:
                    mop = "%s = (${asm_memacc}(this, {}, %s%s_sab)).load%s(%s)"%(event.name, \
                                                                                 "" if self.str_report else "data.", \
                                                                                 event.block.name, \
                                                                                 event.get_size()*8, \
                                                                                 addr)
                else:
                    mop = "%s = %s[%s]%s"%(event.name, \
                                           event.block.name, \
                                           addr, \
                                           " | 0" if self.or_zero else "")
                    
                if postfix:
                    prt = "report.push(\"%s_\"+%s+\": \"+%s%s)"%(event.name, postfix, event.name, approx)
                else:
                    prt = "report.push(\"%s: \"+%s%s)"%(event.name, event.name, approx)

        assert mop
        
        return "".join("%s; "%x for x in [var_def,mop,prt] if x is not None)+"\n"
    

class JST262_JSC_Printer(JST262_Printer):
    NAME = "JS-TEST262-JSC"
    DESC = "\tTEST262 format (Accepted by JSC)"
    str_report = True
    exp_outputs = False
    agent_prefix = "$"
    or_zero = False

class JST262_SM_Printer(JST262_Printer):
    NAME = "JS-TEST262-SM"
    DESC = "\tTEST262 format (Accepted by SM)"
    str_report = True
    exp_outputs = True

class JST262_V8_Printer(JST262_Printer):
    NAME = "JS-TEST262-V8"
    DESC = "\tTEST262 format (Accepted by V8)"
    str_report = False
    exp_outputs = True

class JST262_WASM_V8_Printer(JST262_Printer):
    NAME = "JS-TEST262-W-V8"
    DESC = "\tTEST262 format with WASM (Accepted by V8)"
    str_report = False
    exp_outputs = True
    use_asm = True

class JST262_WASM_JSC_Printer(JST262_Printer):
    NAME = "JS-TEST262-W-JSC"
    DESC = "\tTEST262 format with WASM (Accepted by JSC)"
    str_report = True
    exp_outputs = True
    agent_prefix = "$"
    use_asm = True
    
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
            rbf_dic = {}
            for tup in interp.get_RBF().tuples:
                link = (tup[0], tup[1])
                if link not in rbf_dic:
                    rbf_dic[link] = []
                rbf_dic[link].append(tup[2])
            for ev in rbf_dic:
                rbf_dic[ev].sort()
                label = "%s[%s]"%(interp.get_RBF().name, ", ".join(rbf_dic[ev]))
                ret.append("%s -> %s [label = \"%s\", color=\"%s\"];" % (ev[0], ev[1], label, color))

        relations = []
        defcolor = "black"
        colors = dict([(interp.get_RF(), "red"),\
                       (interp.get_SW(), "blue")])
        
        for relation in RELATIONS:
            if (relation != interp.get_RBF().name):
                if self.__should_print(relation):
                    rel = interp.get_relation_by_name(relation)
                    if rel is not None:
                        relations.append(rel)

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
        options = "splines=false, overlap=true, margin=0, shape=none"
        ret.append("MO [label=<<B>Memory Order</B><br/>%s<br align=\"left\"/>>, %s, pos=\"%d,%d!\"]"%(mo_str, options, iposx+(1.5*self.sepx), maxy))
        
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
            bname = "%s%s[%s]"%(revent.block.name, self.__get_block_size(revent), revent.address[0]/revent.get_size())
        else:
            if revent.is_init():
                value = 0
                bname = "%s-init"%revent.block.name
            else:
                value = revent.get_correct_write_value()
                bname = "%s%s[%s]"%(revent.block.name, self.__get_block_size(revent), revent.address[0]/revent.get_size())
            
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


class JSONPrinter(object):
    NAME = "JSON"
    DESC = "\t\tJSON format"
    TYPE = PrinterType.JSON
    float_pri_js = "%.2f"
    EXT = ".json"

    def __init__(self):
        pass
    
    def print_program(self, program, executions=None):
        def get_dict_attrs(obj, attrs):
            return dict([(x, obj.__dict__[x]) for x in attrs])
        
        def to_json(obj):
            if type(obj) == range:
                return obj[0]
            
            return obj.to_json()

        program.blocks = program.get_blocks()
        execs = self.compute_executions(program, executions)
        return json.dumps(dict([("program", program), ("executions", execs)]), \
                           default=to_json, check_circular=True, indent=2)

    def compute_possible_executions(self, program, interps, models=False):
        return [str(x) for x in self.compute_executions(program, interps, models)]
    
    def compute_executions(self, program, interps, models=False):
        ret = []
        for interp in interps.get_coherent_executions():
            exe = self.compute_execution(program, interp, models)
            if exe not in ret:
                ret.append(exe)

        return ret
    
    def compute_execution(self, program, interp, models=False):
        reads = []
        output = ""
        for el in interp.reads_values:
            value = el.get_correct_read_value()
            if el.is_wtear():
                if (self.float_pri_js%value) == "-0.00":
                    value = 0
                output = (el.name, (""+self.float_pri_js)%float_approx(value))
            else:
                output = (el.name, value)
            reads.append(output)
        return dict(reads)

    def get_extension(self):
        return self.EXT
    
class BePrinter(object):
    NAME = "BE"
    DESC = "\t\tBounded Execution format"
    TYPE = PrinterType.BEXEC
    EXT = ".bex"

    float_pri_js = "%.2f"
    
    def __init__(self):
        pass

    def print_execution(self, program, interp, models=False):
        return self.print_program(program)
    
    def print_program(self, program, executions=None):
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

        if ite.else_events is not None:
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

    def compute_possible_executions(self, program, interps, models=False):
        ret = []
        for interp in interps.get_coherent_executions():
            exe = self.print_execution(program, interp, models)
            if exe not in ret:
                ret.append(exe)

        return ret
    
    def print_executions(self, program, interps):
        return "\n".join(self.compute_possible_executions(program, interps))

    def get_extension(self):
        return self.EXT
    
