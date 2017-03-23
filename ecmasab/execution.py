# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import struct
import ast
import operator
import sys
import re
from six.moves import range

from ecmasab.exceptions import UnreachableCodeException
from ecmasab.utils import values_from_int, values_from_float, float_from_values, int_from_values

READ = "R"
WRITE = "W"
MODIFY = "M"
INIT = "I"
SC = "SC"
UNORD = "U"
WTEAR = "WT"
NTEAR = "NT"

ADD = "ADD"
SUB = "SUB"
AND = "AND"

MAIN = "main"
TYPE = "_Type"

HB = "HB"
RF = "RF"
RBF = "RBF"
MO = "MO"
AO = "AO"
SW = "SW"

DEFAULT_TEAR = NTEAR

RELATIONS = []
RELATIONS.append(HB)
RELATIONS.append(RF)
RELATIONS.append(RBF)
RELATIONS.append(MO)
# RELATIONS.append(AO)
RELATIONS.append(SW)

BLOCKING_RELATIONS = []
# BLOCKING_RELATIONS.append(RBF)
BLOCKING_RELATIONS.append(RF)
# BLOCKING_RELATIONS.append(HB)
# BLOCKING_RELATIONS.append(MO)
# BLOCKING_RELATIONS.append(SW)

def arit_eval(s):
    if sys.version_info[0] >= 3:
        return eval(s)
    
    node = ast.parse(s, mode='eval')

    def _eval(node):

        binOps = {
            ast.Add: operator.add,
            ast.Sub: operator.sub,
            ast.Mult: operator.mul,
            ast.Div: operator.div,
            ast.Mod: operator.mod
        }

        cmpOps = {
            ast.Eq: operator.eq,
            ast.Lt: operator.lt,
            ast.LtE: operator.le,
            ast.Gt: operator.gt,
            ast.GtE: operator.ge
        }
        
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        elif isinstance(node, ast.Str):
            return node.s
        elif isinstance(node, ast.Num):
            return node.n
        elif isinstance(node, ast.Compare):
            return cmpOps[type(node.ops[0])](_eval(node.left), _eval(list(node.comparators)[0]))
        elif isinstance(node, ast.BinOp):
            return binOps[type(node.op)](_eval(node.left), _eval(node.right))
        else:
            raise Exception('Unsupported type {}'.format(node))

    return _eval(node.body)

class Executions(object):
    program = None
    executions = None
    allexecs = None
    
    def __init__(self):
        self.program = None
        self.executions = []
        self.allexecs = False

    def add_execution(self, exe):
        if (not exe.program) and (self.program):
            exe.program = self.program
        assert(isinstance(exe, Execution))
        self.executions.append(exe)

    def get_coherent_executions(self):
        return [x for x in self.executions if x.is_coherent()]
        
    def get_size(self):
        return len(self.executions)
    
class Execution(object):
    happens_before = None
    memory_order = None
    reads_bytes_from = None
    reads_from = None
    synchronizes_with = None
    conditions = None
    
    reads_values = None

    program = None
    
    def __init__(self):
        self.program = None
        self.happens_before = Relation(HB)
        self.memory_order = Relation(MO)
        self.reads_bytes_from = Relation(RBF)
        self.reads_from = Relation(RF)
        self.synchronizes_with = Relation(SW)
        self.reads_values = []
        self.conditions = None

    def __repr__(self):
        relations = []
        relations.append(self.happens_before)
        relations.append(self.memory_order)
        relations.append(self.reads_bytes_from)
        relations.append(self.reads_from)
        relations.append(self.synchronizes_with)
        return " AND ".join([str(x) for x in relations])
        
    def add_read_values(self, read_event):
        self.reads_values.append(read_event)

    def get_events(self):
        events = []
        for thread in self.program.threads:
            events += thread.get_events(True, self.conditions)
        return events

    def is_coherent(self):
        if not self.conditions:
            return True
        
        events = []
        for thread in self.program.threads:
            events += thread.get_events(False)

        read_map = dict((x.name, x) for x in self.reads_values)        

        actual_conds = []
        for event in events:
            if isinstance(event, ITE_Statement):
                for expcond in event.conditions:
                    # evaluation of ITE conditions
                    if str(expcond[0]) in read_map:
                        val1 = read_map[expcond[0].name].get_correct_value()
                    else:
                        val1 = expcond[0]

                    if str(expcond[2]) in read_map:
                        val2 = read_map[expcond[2].name].get_correct_value()
                    else:
                        val2 = expcond[2]

                    loc_cond = arit_eval("%s %s %s"%(val1, expcond[1], val2))
                    actual_cond = (event.condition_name, str(loc_cond).upper())
                    actual_conds.append(actual_cond)

        return set(actual_conds) == set(self.conditions)
    
    def get_HB(self):
        return self.happens_before

    def set_HB(self, rel):
        self.happens_before = rel
    
    def get_MO(self):
        return self.memory_order

    def set_MO(self, rel):
        self.memory_order = rel
    
    def get_RBF(self):
        return self.reads_bytes_from

    def set_RBF(self, rel):
        self.reads_bytes_from = rel
    
    def get_RF(self):
        return self.reads_from

    def set_RF(self, rel):
        self.reads_from = rel
    
    def get_SW(self):
        return self.synchronizes_with

    def set_SW(self, rel):
        self.synchronizes_with = rel

    def set_relation_by_name(self, name, rel):
        if name == RF:
            self.set_RF(rel)
        elif name == RBF:
            self.set_RBF(rel)
        elif name == MO:
            self.set_MO(rel)
        elif name == SW:
            self.set_SW(rel)
        elif name == HB:
            self.set_HB(rel)
        else:
            raise UnreachableCodeException("Not found relation \"%s\""%(name))

        return rel

    def add_condition(self, condition, value):
        if not self.conditions:
            self.conditions = []
        self.conditions.append((condition, value))
    
    def get_relation_by_name(self, name):
        if name == RF:
            return self.get_RF()
        elif name == RBF:
            return self.get_RBF()
        elif name == MO:
            return self.get_MO()
        elif name == SW:
            return self.get_SW()
        elif name == HB:
            return self.get_HB()
        else:
            raise UnreachableCodeException("Not found relation \"%s\""%(name))
    
class Relation(object):
    name = None
    tuples = None

    def __init__(self, name):
        self.name = name
        self.tuples = []

    def __repr__(self):
        return "%s = {%s}"%(self.name, ", ".join([str(x) for x in self.tuples]))
        
    def add_tuple(self, tup):
        self.tuples.append(tup)

    @staticmethod
    def get_bi_tuple(ev1, ev2):
        return (ev1, ev2)

    @staticmethod
    def get_tr_tuple(ev1, ev2, addr):
        return (ev1, ev2, addr)
        
class Program(object):
    threads = []
    blocks = []
    conditions = None
    params = None
    
    def __init__(self):
        self.threads = []
        self.blocks = []
        self.conditions = None
        self.params = None

    def add_thread(self, thread):
        self.threads.append(thread)

    def add_param(self, param, values):
        if not self.params:
            self.params = {}
        self.params[param] = values

    def param_size(self):
        if not self.get_params():
            return 1
        return len(self.get_params())

    def apply_param(self, pardic):
        for thread in self.threads:
            thread.apply_param(pardic)

    def expand_events(self):
        for thread in self.threads:
            thread.expand_events()
            
    def get_params(self):
        if not self.params:
            return None

        configs = []

        for key in self.params:
            param = []
            for el in self.params[key]:
                param.append([[key, el]])
            configs.append(param)

        ret = []
        for el in configs:
            ret = self.__combine_params(ret, el)

        return ret
            
    def __combine_params(self, pl1, pl2):
        if not pl1:
            return pl2
        if not pl2:
            return pl1
        ret = []
        for p1 in  pl1:
            for p2 in pl2:
                ret.append(p1+p2)

        return ret
    
    def get_blocks(self):
        blocks = []
        for thread in self.threads:
            blocks += thread.get_blocks()
        return list(set(blocks))

    def get_conditions(self):
        conditions = []
        for thread in self.threads:
            conditions += thread.get_conditions()

        self.conditions = list(set(conditions))
        return self.conditions

    def has_conditions(self):
        self.get_conditions()
        return len(self.conditions)
    
    def get_events(self):
        events = []
        for thread in self.threads:
            events += thread.get_events(True)
        return events

    def sort_threads(self):
        threads_map = {}
        for thread in self.threads:
            threads_map[thread.name] = thread

        self.threads = []
        if MAIN in threads_map:
            self.threads.append(threads_map[MAIN])
            del(threads_map[MAIN])
            
        keys = list(threads_map.keys())
        keys.sort()
        for key in keys:
            self.threads.append(threads_map[key])
    
class Block(object):
    name = None
    size = None

    def __init__(self, name):
        self.name = name
        self.size = 1

    def __repr__(self):
        return self.name

    def update_size(self, size):
        if (not self.size) or (not size):
            return
        if size > self.size:
            self.size = size
        
class Thread(object):
    events = None
    uevents = None
    name = None
    
    def __init__(self, name):
        self.events = []
        self.uevents = []
        self.name = name

    def get_conditions(self):
        conditions = []
        for event in self.events:
            if isinstance(event, ITE_Statement):
                conditions.append(event.condition_name)
        return list(set(conditions))

    def apply_param(self, pardic):
        for event in self.events:
            event.apply_param(pardic)

    def expand_events(self):
        self.uevents = None
        self.get_events(True)
        
    def get_events(self, expand_loops, conditions=None):
        if not expand_loops:
            return self.events

        if self.uevents and not conditions:
            return self.uevents
        
        i = 0
        self.uevents = self.events
        while i < len(self.uevents):
            if isinstance(self.uevents[i], For_Loop):
                self.uevents = self.uevents[:i] + self.uevents[i].get_uevents() + self.uevents[i+1:]
            if isinstance(self.uevents[i], ITE_Statement):
                self.uevents = self.uevents[:i] + self.uevents[i].get_uevents(conditions) + self.uevents[i+1:]
            i += 1

        id_ev = 0
        for event in self.uevents:
            event.id_ev = id_ev
            id_ev += 1
        return self.uevents

    def get_blocks(self):
        blocks = set([])
        for event in self.get_events(True):
            blocks.add(event.block)
        return list(blocks)
    
    def append(self, event):
        self.events.append(event)
        return event

class For_Loop(object):
    events = None
    uevents = None
    fromind = None
    toind = None
    cname = None
    
    def __init__(self):
        self.events = []
        self.uevents = None
        self.fromind = 0
        self.toind = 0
        self.cname = None

    def set_values(self, cname, frind, toind):
        self.cname = cname
        self.fromind = frind
        self.toind = toind

    def apply_param(self, pardic):
        for event in self.events:
            event.apply_param(pardic)
            
        self.uevents = None
        self.get_uevents()

    def get_uevents(self):
        if self.uevents:
            return self.uevents
        self.uevents = []
        self.__compute_events()
        return self.uevents
    
    def append(self, event):
        self.events.append(event)

    def __compute_events(self):
        for i in range(self.fromind, self.toind+1):
            for event in self.events:
                size = event.get_size()
                value = event.value
                offset = event.offset
                if type(offset) != int:
                    offset = str(offset).replace(self.cname,str(i))
                    offset = int(arit_eval(offset))
                
                baddr = size*offset
                eaddr = (size*(offset+1))-1
                address = range(baddr, eaddr+1, 1)
                name = "%s_%s"%(event.name, i)

                me = Memory_Event()

                me.name = name
                me.operation = event.operation
                me.tear = event.tear
                me.ordering = event.ordering
                me.address = address
                me.block = event.block

                if value:
                    value = [x.replace(self.cname,str(i)) for x in value]
                    me.value = value
                    if me.value_is_number():
                        if event.is_wtear():
                            value = float(arit_eval("".join(value)))
                            me.set_values_from_float(value, baddr, eaddr)
                        else:
                            value = int(arit_eval("".join(value)))
                            me.set_values_from_int(value, baddr, eaddr)
                self.uevents.append(me)

class ITE_Statement(object):
    conditions = None
    then_events = None
    else_events = None
    condition_name = None
    global_id_cond = 1
    pconditions = None
    
    OP_ITE = "ITE"
    B_THEN = "THEN"
    B_ELSE = "ELSE"

    FALSE = "FALSE"
    TRUE = "TRUE"
    
    def __init__(self):
        self.conditions = []
        self.then_events = None
        self.else_events = None
        self.condition_name = None
        self.pconditions = None

    @staticmethod        
    def get_unique_condition():
        ret = ITE_Statement.global_id_cond
        ITE_Statement.global_id_cond = ITE_Statement.global_id_cond + 1
        return "id%s"%ret

    @staticmethod        
    def reset_unique_names():
        ITE_Statement.global_id_cond = 1
        
    def apply_param(self, pardic):
        if not self.pconditions:
            self.pconditions = self.conditions
        self.conditions = self.pconditions
        loc_conds = []
        for cond in self.conditions:
            newcond = []
            for el in cond:
                if el in pardic:
                    newcond.append(pardic[el])
                else:
                    newcond.append(el)
            loc_conds.append(tuple(newcond))

        self.conditions = loc_conds

        for el in self.then_events:
            el.apply_param(pardic)

        for el in self.else_events:
            el.apply_param(pardic)
            
    def append_condition(self, el1, op, el2):
        self.conditions.append((el1,op,el2))
        self.condition_name = "%s_cond"%(ITE_Statement.get_unique_condition())
    
    def append_then(self, event):
        if not self.then_events:
            self.then_events = []
        event.add_enabling_condition((self.condition_name, 1))
        event.add_info(self.OP_ITE, self.B_THEN)
        self.then_events.append(event)

    def append_else(self, event):
        if not self.else_events:
            self.else_events = []
        event.add_enabling_condition((self.condition_name, 0))
        event.add_info(self.OP_ITE, self.B_ELSE)
        self.else_events.append(event)

    def has_else(self):
        return self.else_events is not None

    def get_uevents(self, assconds=None):
        uevents = []
        for condition in self.conditions:
            for ind in [0,2]:
                if isinstance(condition[ind], Memory_Event):
                    uevents.append(condition[ind])
                
        acthen = True
        acelse = True
        if assconds:
            for asscond in assconds:
                if (asscond == (self.condition_name, self.TRUE)):
                    acelse = False
                if (asscond == (self.condition_name, self.FALSE)):
                    acthen = False

        if acthen: uevents += self.then_events
        if acelse: uevents += self.else_events
        return uevents
    
class Memory_Event(object):
    name = None
    operation = None
    tear = None
    ordering = None
    address = None
    block = None
    values = None
    global_id_ev = 1
    offset = None
    size = None
    value = None
    pvalue = None
    id_ev = None
    en_conditions = None
    operator = None
    
    info = None
    
    def __init__(self):
        self.name = None
        self.operation = None
        self.tear = None
        self.ordering = None
        self.address = None
        self.block = None
        self.values = None
        self.offset = None
        self.size = None
        self.value = None
        self.pvalue = None
        self.en_conditions = None
        self.info = None
        self.operator = None
        
        self.id_ev = Memory_Event.global_id_ev

    def __repr__(self):
        return self.name

    def apply_param(self, pardic):
        if not self.pvalue:
            self.pvalue = self.value
        self.value = self.pvalue
        if self.value:
            assert(type(self.value) == list)
            value = []
            for x in range(len(self.value)):
                val = self.value[x]
                value.append(str(pardic[val]) if val in pardic else str(val))
            self.value = value
            if self.value_is_number():
                value = arit_eval("".join(value))
                if self.is_wtear():
                    self.set_values_from_float(float(value),\
                                               self.address[0], \
                                               self.address[-1])
                else:
                    self.set_values_from_int(float(value),\
                                               self.address[0], \
                                               self.address[-1])
                
    @staticmethod        
    def reset_unique_names():
        Memory_Event.global_id_ev = 1
    
    @staticmethod        
    def get_unique_name():
        ret = Memory_Event.global_id_ev
        Memory_Event.global_id_ev = Memory_Event.global_id_ev + 1
        return "id%s"%ret

    def value_is_number(self):
        if self.values:
            return True
        if not self.value:
            return False
        assert(type(self.value) == list)
        for el in self.value:
            if re.search('[a-zA-Z]', el):
                return False
            if not len(el):
                return False
        return True

    def is_read(self):
        return self.operation == READ

    def is_write(self):
        return self.operation == WRITE

    def is_modify(self):
        return self.operation == MODIFY

    def is_add(self):
        return self.operator == ADD

    def is_sub(self):
        return self.operator == SUB
    
    def is_read_or_modify(self):
        return self.is_read() or self.is_modify()

    def is_write_or_modify(self):
        return self.is_write() or self.is_modify()

    def is_ntear(self):
        return self.tear == NTEAR

    def is_wtear(self):
        return self.tear == WTEAR

    def is_init(self):
        return self.ordering == INIT

    def is_atomic(self):
        return self.ordering == SC
    
    def set_values(self, values):
        self.values = values

        self.block.update_size(len(values))

    def get_values(self):
        if self.is_init():
            self.set_init_values()
        return self.values
        
    def get_size(self):
        if self.size:
            return self.size

        if self.address:
            self.size = len(self.address)
        return self.size

    def add_enabling_condition(self, condition):
        if not self.en_conditions:
            self.en_conditions = []

        self.en_conditions.append(condition)

    def has_condition(self):
        if not self.en_conditions:
            return False
        return True

    def add_info(self, key, value):
        if not self.info:
            self.info = {}
        self.info[key] = value

    def has_info(self, key):
        if not self.info:
            return False
        return key in self.info
    
    def set_values_from_int(self, int_value, begin, end):
        self.offset = begin
        self.values = values_from_int(int_value, begin, end)
        self.tear = NTEAR
        self.block.update_size(end+1)

    def set_values_from_float(self, float_value, begin, end):
        self.offset = begin
        self.values = values_from_float(float_value, begin, end)
        self.tear = WTEAR
        self.block.update_size(end+1)
        
    def set_init_values(self):
        self.address = range(0, self.block.size, 1)
        self.values = [0]*self.block.size
        
    def get_correct_value(self):
        if self.is_read():
            return self.get_correct_read_value()
        elif self.is_write():
            return self.get_correct_write_value()
        elif self.is_modify():
            return self.get_correct_write_value()
        else:
            raise UnreachableCodeException("Event type not defined")

    def __compute_correct_value(self, with_offset=True):
        if not self.values:
            return None
        offset = self.offset if (self.offset and with_offset) else 0
        if self.is_ntear():
            return int_from_values(self.values[offset:])
        if self.is_wtear():
            return float_from_values(self.values[offset:])
        return None
    
    def get_correct_write_value(self):
        return self.__compute_correct_value()

    def get_correct_read_value(self):
        return self.__compute_correct_value(False)
    
