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
from six.moves import range

from ecmasab.exceptions import UnreachableCodeException

READ = "R"
WRITE = "W"
MODIFY = "M"
INIT = "I"
SC = "SC"
UNORD = "U"
WTEAR = "WT"
NTEAR = "NT"

MAIN = "main"
TYPE = "_Type"

HB = "HB"
RF = "RF"
RBF = "RBF"
MO = "MO"
AO = "AO"
SW = "SW"

FALSE = "FALSE"
TRUE = "TRUE"

OP_PRINT = "PRINT"

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
    binOps = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.div,
        ast.Mod: operator.mod
    }
    
    node = ast.parse(s, mode='eval')

    def _eval(node):
        if sys.version_info[0] >= 3:
            return ast.literal_eval(node)
        
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        elif isinstance(node, ast.Str):
            return node.s
        elif isinstance(node, ast.Num):
            return node.n
        elif isinstance(node, ast.BinOp):
            return binOps[type(node.op)](_eval(node.left), _eval(node.right))
        else:
            raise Exception('Unsupported type {}'.format(node))

    return _eval(node.body)

class Executions(object):
    program = None
    executions = None

    def __init__(self):
        self.program = None
        self.executions = []

    def add_execution(self, exe):
        if (not exe.program) and (self.program):
            exe.program = self.program
        assert(isinstance(exe, Execution))
        self.executions.append(exe)


    def get_valid_executions(self):
        return [x for x in self.executions if x.is_valid()]
        
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

    def is_valid(self):
        events = []
        for thread in self.program.threads:
            events += thread.get_events(False)

        read_map = dict((x.name, x) for x in self.reads_values)        

        actual_conds = []
        for event in events:
            if isinstance(event, ITE_Statement):
                for expcond in event.conditions:
                    loc_cond = read_map[expcond[0].name].get_correct_value() == arit_eval(expcond[1])
                    actual_cond = (event.condition_name, str(loc_cond).upper())
                    actual_conds.append(actual_cond)
        return actual_conds == self.conditions
    
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
    
    def __init__(self):
        self.threads = []
        self.blocks = []
        self.conditions = None

    def add_thread(self, thread):
        self.threads.append(thread)

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

    def get_uevents(self):
        if not self.uevents:
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

                offset = offset.replace(self.cname,str(i))
                offset = int(arit_eval(offset))
                
                baddr = size*offset
                eaddr = (size*(offset+1))-1
                address = range(baddr, eaddr+1, 1)
                name = "%s_%s"%(event.name, i)

                me = Memory_Event(name = name, \
                                  operation = event.operation, \
                                  tear = event.tear, \
                                  ordering = event.ordering, \
                                  address = address, \
                                  block = event.block,\
                                  values = None)

                if value:
                    value = value.replace(self.cname,str(i))
                    if event.is_wtear():
                        value = float(arit_eval(value))
                        me.set_values_from_float(value, baddr, eaddr)
                    else:
                        value = int(arit_eval(value))
                        me.set_values_from_int(value, baddr, eaddr)

                self.uevents.append(me)

class ITE_Statement(object):
    conditions = None
    then_events = None
    else_events = None
    condition_name = None
    
    def __init__(self):
        self.conditions = []
        self.then_events = None
        self.else_events = None
        self.condition_name = None

    def append_condition(self, condition):
        self.conditions.append(condition)
        self.condition_name = "%s_cond"%(Memory_Event.get_unique_condition())
    
    def append_then(self, event):
        if not self.then_events:
            self.then_events = []
        event.add_enabling_condition((self.condition_name, 1))
        self.then_events.append(event)

    def append_else(self, event):
        if not self.else_events:
            self.else_events = []
        event.add_enabling_condition((self.condition_name, 0))
        self.else_events.append(event)

    def has_else(self):
        return self.else_events is not None

    def get_uevents(self, assconds=None):
        uevents = []
        for condition in self.conditions:
            uevents.append(condition[0])

        acthen = True
        acelse = True
        if assconds:
            for asscond in assconds:
                if (asscond == (self.condition_name, TRUE)):
                    acelse = False
                if (asscond == (self.condition_name, FALSE)):
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
    global_id_cond = 1
    offset = None
    size = None
    value = None
    id_ev = None
    en_conditions = None
    
    op_purpose = None
    
    def __init__(self, name, operation, tear, ordering, address, block, values):
        if not name:
            name = Memory_Event.get_unique_name()
        if not tear:
            tear = DEFAULT_TEAR
        self.name = name
        self.operation = operation
        self.tear = tear
        self.ordering = ordering
        self.address = address
        self.block = block
        self.values = values
        self.op_purpose = None
        self.size = None
        self.value = None
        self.id_ev = Memory_Event.global_id_ev
        self.en_conditions = None

        if values:
            self.block.update_size(len(values))

    def __repr__(self):
        return self.name

    @staticmethod        
    def reset_unique_names():
        Memory_Event.global_id_ev = 1
        Memory_Event.global_id_cond = 1
    
    @staticmethod        
    def get_unique_name():
        ret = Memory_Event.global_id_ev
        Memory_Event.global_id_ev = Memory_Event.global_id_ev + 1
        return "id%s"%ret

    @staticmethod        
    def get_unique_condition():
        ret = Memory_Event.global_id_cond
        Memory_Event.global_id_cond = Memory_Event.global_id_cond + 1
        return "id%s"%ret
    
    def is_read(self):
        return self.operation == READ

    def is_write(self):
        return self.operation == WRITE

    def is_modify(self):
        return self.operation == MODIFY

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
    
    def set_param_value(self, size, value):
        self.size = size
        self.value = value
        
    def set_values(self, values):
        self.offset = None
        self.values = values

        self.block.update_size(len(values))

    def get_size(self):
        if not self.size:
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
    
    def set_values_from_int(self, int_value, begin, end):
        self.offset = begin
        size = (end-begin)+1
        values = list(struct.pack(self.__get_int_type(size), int_value))
        self.values = ([None] * begin) + values

        self.tear = NTEAR

        self.block.update_size(end+1)

    def set_values_from_float(self, float_value, begin, end):
        self.offset = begin
        size = (end-begin)+1
        values = list(struct.pack(self.__get_float_type(size), float_value))
        self.values = ([None] * begin) + values

        self.tear = WTEAR

        self.block.update_size(end+1)
        
    def set_init_values(self):
        self.address = range(0, self.block.size, 1)
        self.values = [0]*self.block.size
        
    def get_correct_value(self):
        if not self.values:
            return None
        if self.is_ntear():
            return self.get_int_value()
        if self.is_wtear():
            return self.get_float_value()
        return None
        
    def get_int_value(self):
        if not self.values:
            return None
        values = self.values[self.offset:]
        values = struct.unpack(self.__get_int_type(len(values)), bytearray(values))
        return values[0]

    def get_float_value(self):
        if not self.values:
            return None
        values = self.values[self.offset:]
        values = struct.unpack(self.__get_float_type(len(values)), bytearray(values))
        return values[0]
    
    def __get_int_type(self, size):
        if size <= 1:
            return '<B'
        elif size <= 2:
            return '<H'
        elif size <= 4:
            return '<I'
        else:
            raise UnreachableCodeException("Type size \"%s\" not valid"%(size))

    def __get_float_type(self, size):
        if size <= 4:
            return '<f'
        elif size <= 8:
            return '<d'
        else:
            raise UnreachableCodeException("Type size \"%s\" not valid"%(size))
        
