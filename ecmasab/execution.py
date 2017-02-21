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
import six

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

OP_PRINT = "PRINT"

DEFAULT_TEAR = NTEAR

RELATIONS = []
RELATIONS.append(HB)
RELATIONS.append(RF)
RELATIONS.append(RBF)
RELATIONS.append(MO)
RELATIONS.append(AO)
RELATIONS.append(SW)

BLOCKING_RELATIONS = []
# BLOCKING_RELATIONS.append(RBF)
BLOCKING_RELATIONS.append(RF)
# BLOCKING_RELATIONS.append(HB)
# BLOCKING_RELATIONS.append(MO)
# BLOCKING_RELATIONS.append(SW)

class Executions():
    program = None
    executions = None

    def __init__(self):
        self.program = None
        self.executions = []

    def add_execution(self, exe):
        if (not exe.get_program()) and (self.program):
            exe.set_program(self.program)
        assert(isinstance(exe, Execution))
        self.executions.append(exe)

    def get_executions(self):
        return self.executions

    def get_program(self):
        return self.program

    def set_program(self, program):
        self.program = program

    def get_size(self):
        return len(self.executions)

    def __eq__(self, item):
        if (self.get_program() != item.get_program()):
            return False
        other_execs = item.get_executions()
        for execution in self.executions:
            if execution not in other_execs:
                return False
        return True
    
class Execution():
    happens_before = None
    memory_order = None
    reads_bytes_from = None
    reads_from = None
    synchronizes_with = None

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

    def __eq__(self, item):
        checks = []
        checks.append((self.get_HB(), item.get_HB()))
        checks.append((self.get_MO(), item.get_MO()))
        checks.append((self.get_RBF(), item.get_RBF()))
        checks.append((self.get_RF(), item.get_RF()))
        checks.append((self.get_SW(), item.get_SW()))
        checks.append((self.get_program(), item.get_program()))
        for check in checks:
            if check[0] != check[1]:
                return False

        return True

    
    def __repr__(self):
        relations = []
        relations.append(self.happens_before)
        relations.append(self.memory_order)
        relations.append(self.reads_bytes_from)
        relations.append(self.reads_from)
        relations.append(self.synchronizes_with)
        return " AND ".join([str(x) for x in relations])
        
    def set_program(self, program):
        self.program = program

    def get_program(self):
        return self.program
        
    def add_read_values(self, read_event):
        self.reads_values.append(read_event)

    def get_reads_values(self):
        return self.reads_values
        
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
        elif name == RF:
            self.set_RF(rel)
        elif name == SW:
            self.set_SW(rel)
        elif name == HB:
            self.set_HB(rel)
        else:
            return None

        return rel

    def get_relation_by_name(self, name):
        if name == RF:
            return self.get_RF()
        elif name == RBF:
            return self.get_RBF()
        elif name == MO:
            return self.get_MO()
        elif name == RF:
            return self.get_RF()
        elif name == SW:
            return self.get_SW()
        elif name == HB:
            return self.get_HB()
        else:
            return None

        return None
    
            
class Relation():
    name = None
    tuples = None

    def __init__(self, name):
        self.name = name
        self.tuples = []

    def __repr__(self):
        return "%s = {%s}"%(self.name, ", ".join([str(x) for x in self.tuples]))

    def __eq__(self, item):
        if item.get_name() != self.get_name():
            return False
        other_tuples = item.get_tuples()
        for tup in self.tuples:
            if tup not in other_tuples:
                return False
            
        return True
    
    def get_name(self):
        return self.name

    def set_name(self, name):
        self.name = name
        
    def add_tuple(self, tup):
        self.tuples.append(tup)

    def get_tuples(self):
        return self.tuples

    @staticmethod
    def get_bi_tuple(ev1, ev2):
        return (ev1, ev2)

    @staticmethod
    def get_tr_tuple(ev1, ev2, addr):
        return (ev1, ev2, addr)
    

        
class Program():
    threads = []
    blocks = []
    
    def __init__(self):
        self.threads = []
        self.blocks = []

    def __eq__(self, item):
        other_threads = item.get_threads()
        for thread in self.threads:
            if thread not in other_threads:
                return False
        return True
        
    def add_thread(self, thread):
        self.threads.append(thread)

    def get_threads(self):
        return self.threads

    def get_blocks(self):
        blocks = []
        for thread in self.threads:
            blocks += thread.get_blocks()
        return list(set(blocks))

    def get_events(self):
        events = []
        for thread in self.threads:
            events += thread.get_events()
        return events

    def sort_threads(self):
        threads_map = {}
        for thread in self.threads:
            threads_map[thread.get_name()] = thread

        self.threads = []
        if MAIN in threads_map:
            self.threads.append(threads_map[MAIN])
            del(threads_map[MAIN])
            
        keys = threads_map.keys()
        keys.sort()
        for key in keys:
            self.threads.append(threads_map[key])
    
class Block():
    name = None
    size = None

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return self.name

    def get_name(self):
        return self.name

    def set_name(self, name):
        self.name = name
    
    def get_size(self):
        return self.size

    def set_size(self, size):
        self.size = size

    def update_size(self, size):
        if size > self.size:
            self.size = size
        
class Thread():
    events = []
    name = None
    
    def __init__(self, name):
        self.events = []
        self.name = name
        
    def get_events(self):
        return self.events

    def __eq__(self, item):
        if self.get_name() != item.get_name():
            return False
        if self.get_events() != item.get_events():
            return False
        return True

    def get_blocks(self):
        blocks = []
        for event in self.events:
            blocks.append(event.get_block())
        return blocks
    
    def get_name(self):
        return self.name
    
    def append(self, event):
        self.events.append(event)
        return event

    def add(self, events):
        for event in events:
            self.events.append(event)
        return self.events
    
class Memory_Event():
    name = None
    operation = None
    tear = None
    ordering = None
    address = None
    block = None
    values = None
    id_ev = 1
    offset = None

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

        if values:
            self.block.update_size(len(values))

    def __repr__(self):
        return self.name

    def __eq__(self, item):
        return self.get_name() == item.get_name()


    @staticmethod        
    def reset_unique_names():
        Memory_Event.id_ev = 1
    
    @staticmethod        
    def get_unique_name():
        ret = Memory_Event.id_ev
        Memory_Event.id_ev = Memory_Event.id_ev + 1
        return "id%s"%ret
    
    def get_name(self):
        return self.name

    def get_block(self):
        return self.block

    def get_address(self):
        return self.address

    def get_operation(self):
        return self.operation

    def get_op_purpose(self):
        return self.op_purpose
    
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
    
    def get_tear(self):
        return self.tear

    def get_ordering(self):
        return self.ordering

    def get_address(self):
        return self.address

    def get_values(self):
        return self.values

    def set_values(self, values):
        self.values = values

        self.block.update_size(len(values))

    def set_op_purpose(self, op_purpose):
        self.op_purpose = op_purpose
        
    def set_values_from_int(self, int_value, begin, end):
        self.offset = begin
        size = (end-begin)+1
        values = list(struct.pack(self.__get_int_type(size), int_value))
        self.values = ([None] * begin) + values

        self.tear = NTEAR

        self.block.update_size(end)

    def set_values_from_float(self, float_value, begin, end):
        self.offset = begin
        size = (end-begin)+1
        values = list(struct.pack(self.__get_float_type(size), float_value))
        self.values = ([None] * begin) + values

        self.tear = WTEAR

        self.block.update_size(end)
        
    def set_int_values(self, int_value):
        self.address = range(0, self.block.get_size(), 1)
        self.set_values_from_int(int_value, 0, self.block.get_size())

    def set_init_values(self):
        self.address = range(0, self.block.get_size(), 1)
        self.values = [0]*self.block.get_size()
        
    def get_correct_value(self):
        if not self.values:
            return None
        if self.tear == NTEAR:
            return self.get_int_value()
        if self.tear == WTEAR:
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
        elif size <= 8:
            return '<Q'
        else:
            raise UnreachableCodeException()

    def __get_float_type(self, size):
        if size <= 4:
            return '<f'
        elif size <= 8:
            return '<d'
        else:
            raise UnreachableCodeException()
        
