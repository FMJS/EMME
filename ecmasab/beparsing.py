# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import copy
import sys
import six

from ecmasab.execution import Thread, Program, Block, Memory_Event, Executions, Execution, Relation, For_Loop
from ecmasab.execution import READ, WRITE, INIT, SC, UNORD, WTEAR, NTEAR, MAIN
from ecmasab.execution import HB, RF, RBF, MO, AO, SW
from ecmasab.execution import OP_PRINT
from ecmasab.exceptions import UnreachableCodeException

from pyparsing import Word, nums, alphas, Suppress, LineEnd, restOfLine, Literal, ZeroOrMore, Empty, oneOf, operatorPrecedence, opAssoc, Combine, Optional

T_ALOAD = "Atomics.load"
T_AND = "AND"
T_ASTORE = "Atomics.store"
T_CCB = "}"
T_CM = ","
T_COM = "//"
T_CP = ")"
T_CSB = "]"
T_DIV = "/"
T_DOT = "."
T_DOTS = ".."
T_EQ = "="
T_FLO32 = "-F32"
T_FLO64 = "-F64"
T_FOR = "for"
T_INT16 = "-I16"
T_INT32 = "-I32"
T_INT8 = "-I8"
T_MIN = "-"
T_MUL = "*"
T_NEW = "new"
T_NL = "\n"
T_OCB = "{"
T_OP = "("
T_OSB = "["
T_PR = "print"
T_SAB = "SharedArrayBuffer"
T_SEMI = ";"
T_SUM = "+"
T_THREAD = "Thread"
T_US = "_"
T_VAR = "var"

P_ACCESS = "access"
P_ADDR = "address"
P_ADDRSET = "address-set"
P_COMMENT = "comment"
P_CSCOPE = "closescope"
P_DATA = "data"
P_EMPTY = "empty"
P_EXPR = "expr"
P_FLOOP = "floop"
P_INIT = "init"
P_LOAD = "load"
P_PRINT = "print"
P_RANGE = "range"
P_READ = "read"
P_SABASS = "sab-assign"
P_SABDEF = "sabdef"
P_SIZE = "varsize"
P_STORE = "store"
P_TRDB = "thread-begin"
P_TYPEOP = "typeop"
P_VALUE = "value"
P_VARASS = "var-assign"
P_VNAME = "varname"
P_WRITE = "write"

P_TRREL = "tr-relation"
P_BIREL = "bi-relation"
P_EMREL = "em-relation"

class ParsingErrorException(Exception):
    pass

class BeParser():
    program = None
    program_parser = None

    executions = None
    execution_parser = None
    
    commands = None
    models = None

    def __init__(self):
        Memory_Event.reset_unique_names()

        self.commands = []
        self.models = []

        self.program = None
        self.executions = None

        self.program_parser = self.__init_program_parser()
        self.execution_parser = self.__init_execution_parser()

    def __init_execution_parser(self):
        varname = Word(alphas+nums+T_US)
        bitup = T_OP + varname + T_CM + varname + T_CP
#        trtup = T_OP + varname + T_CM + varname + T_CM + varname + T_CP
        trtup = T_OP + T_OP + varname + T_CM + varname + T_CP + T_CM + varname + T_CP

        birel = bitup + ZeroOrMore(T_CM + bitup)
        trrel = trtup + ZeroOrMore(T_CM + trtup)

        trrelation = (varname + T_EQ + T_OCB + (trrel) + T_CCB)(P_TRREL)
        birelation = (varname + T_EQ + T_OCB + (birel) + T_CCB)(P_BIREL)
        emrelation = (varname + T_EQ + T_OCB + (Empty()) + T_CCB)(P_EMREL)

        relation = trrelation | birelation | emrelation
        
        relations = relation + ZeroOrMore(T_AND + relation)

        return relations


    def __init_program_parser(self):
        ivalue = Word(nums)
        fvalue = Combine(ivalue + Optional(Literal(T_DOT) + Optional(ivalue)))
        strname = Word(alphas+nums+T_US)
        varname = (strname)(P_VNAME)

        typeop = (Literal(T_FLO64) | Literal(T_FLO32) | Literal(T_INT8) | Literal(T_INT16) | Literal(T_INT32))(P_TYPEOP)
        sabname = varname + typeop

        operand = fvalue | ivalue | strname

        signop = Literal(T_SUM) | Literal(T_MIN)
        multop = Literal(T_MUL) | Literal(T_DIV)
        plusop = Literal(T_SUM) | Literal(T_MIN)

        expr = operatorPrecedence( operand,
                                   [(signop, 1, opAssoc.RIGHT),
                                    (multop, 2, opAssoc.LEFT),
                                    (plusop, 2, opAssoc.LEFT),]
        )
        
        data = (T_OSB + Word(nums+T_CM) + T_CSB)(P_DATA)
        addrfix = (T_OSB + Word(nums) + T_CSB)(P_ADDR)
        nrange = (Word(nums) + T_DOTS + Word(nums))(P_RANGE)
        addrrange = (T_OSB + nrange + T_CSB)(P_ADDR)
        addrparam = (T_OSB + expr + T_CSB)(P_ADDR)
        
        addr = addrparam | addrrange
        
        emptyline = (restOfLine+LineEnd())(P_EMPTY)
        comment = (T_COM + restOfLine + LineEnd())(P_COMMENT)

        sab_def = (T_VAR + varname + T_EQ + T_NEW + T_SAB + T_OP + T_CP + T_SEMI)(P_SABDEF)

        ssaddr = (T_CM + expr)(P_ADDR)
        ssval = (T_CM + expr)(P_VALUE)
        sabstore = (T_ASTORE + T_OP + sabname + ssaddr + ssval + T_CP + T_SEMI)(P_STORE)
        
        sabaccess = (sabname + addr)(P_ACCESS)
        sabload  = (T_ALOAD + T_OP + sabname + ssaddr + T_CP)(P_LOAD)

        sabread = (sabload | sabaccess)

        value = (expr)(P_VALUE)
        sabassign = (sabaccess + T_EQ + value + T_SEMI)(P_SABASS)
        varassign = (varname + T_EQ + sabread + T_SEMI)(P_VARASS)

        assign = varassign | sabassign

        printv = (T_PR + T_OP + sabread + T_CP + T_SEMI)(P_PRINT)

        threaddef = (T_THREAD + varname + Literal(T_OCB))(P_TRDB)
        closescope = (Literal(T_CCB))(P_CSCOPE)

        floop = (T_FOR + T_OP + varname + T_EQ + nrange + T_CP + T_OCB)(P_FLOOP)

        command = sab_def | sabstore | assign | threaddef | printv | floop | closescope

        return ZeroOrMore(command)

        
    def program_from_string(self, strinput):
        Memory_Event.reset_unique_names()
        self.__parse_program(strinput)
        self.__populate_program()
        return self.program

    def executions_from_string(self, strinput):
        self.__parse_executions(strinput)
        self.__populate_executions()
        if self.program:
            self.__compute_reads_values()
        return self.executions


    def __compute_reads_values(self):
        program = self.executions.get_program()
        executions = self.executions.get_executions()
        events = program.get_events()
        ev_map = dict((x.get_name(), x) for x in events)
        read_evs = [x for x in events if x.is_read()]

        for exe in executions:
            rbf_map = dict(((x[0], int(x[2])), x[1]) for x in exe.get_RBF().get_tuples())
            for read_event in read_evs:
                values = []
                for i in read_event.get_address():
                    write_event = ev_map[rbf_map[(read_event.get_name(), i)]]
                    value = write_event.get_values()[i]
                    values.append(value)
                new_read_event = copy.deepcopy(read_event)
                new_read_event.set_values(values)
                exe.add_read_values(new_read_event)

    
    def __parse_executions(self, strinput):
        for line in strinput.split(T_NL):
            if line == "": continue
            rels = []
            for relation in line.split(T_AND):
                if relation == "": continue
                rels.append(self.execution_parser.parseString(relation))
            self.models.append(rels)

        return self

    def __populate_executions(self):
        execs = Executions()
        execs.set_program(self.program)
        for model in self.models:
            execution = Execution()
            for relation in model:
                rel = Relation(relation[0])
                size = 9 if relation.getName() == P_TRREL else \
                       6 if relation.getName() == P_BIREL else 0
                if size == 0: continue
                for i in range(3, len(relation), size):
                    rel.add_tuple(self.__get_tuple(size, relation[i:i+size]))
                
                self.__add_relation(execution, rel)
            execs.add_execution(execution)

        self.executions = execs


    def __add_relation(self, exe, rel):

        if rel.get_name() == HB:
            exe.set_HB(rel)
        elif rel.get_name() == MO:
            exe.set_MO(rel)
        elif rel.get_name() == AO:
            pass
        elif rel.get_name() == RBF:
            exe.set_RBF(rel)
        elif rel.get_name() == RF:
            exe.set_RF(rel)
        elif rel.get_name() == SW:
            exe.set_SW(rel)
        else:
            raise UnreachableCodeException()
            
    def __get_tuple(self, size, tup):
        if size == 6:
            ev1 = tup[1]
            ev2 = tup[3]
            return Relation.get_bi_tuple(ev1, ev2)
        if size == 9:
            ev1 = tup[1]
            ev2 = tup[3]
            addr = tup[6]
            return Relation.get_tr_tuple(ev1, ev2, addr)

        raise UnreachableCodeException()
            
                
    def __parse_program(self, strinput):
        strinput = strinput.replace(T_SEMI, T_NL)
        for line in strinput.split(T_NL):
            if line.strip() == "": continue
            line = line+T_SEMI
            pline = self.program_parser.parseString(line)
            if not pline:
                raise ParsingErrorException("ERROR: not well formed command \"%s\""%line)
            self.commands.append(pline)

        return self

    def __get_var_size(self, typeop):
        if typeop == T_INT8:
            return 1
        elif typeop == T_INT16:
            return 2
        elif typeop == T_INT32:
            return 4
        elif typeop == T_FLO32:
            return 4
        elif typeop == T_FLO64:
            return 8
        else:
            raise UnreachableCodeException("Type %s not valid"%str(typeop))

    def __var_type_is_int(self, typeop):
        if typeop in [T_INT8, T_INT16, T_INT32]:
            return True
        return False

    def __var_type_is_float(self, typeop):
        if typeop in [T_FLO32, T_FLO64]:
            return True
        return False
    
    def __populate_program(self):
        program = Program()
        thread = Thread(MAIN)
        floop = None
        blocks = {}
        op_purpose = None
        sab_defs = []
        while len(self.commands):
            command = self.commands[0]
            self.commands = self.commands[1:]
            command_name = command.getName()
            
            if command_name == P_TRDB:
                thread_name = command[1]
                if thread:
                    program.add_thread(thread)
                thread = Thread(thread_name)
            elif command_name == P_SABDEF:
                block_name = command[1]
                block = Block(block_name)
                blocks[block_name] = block

                name = "%s_%s_%s"%(Memory_Event.get_unique_name(), WRITE, thread.get_name())
                me = Memory_Event(name = name, \
                                  operation = WRITE, \
                                  tear = NTEAR, \
                                  ordering = INIT, \
                                  address = None, \
                                  block = block,\
                                  values = None)

                # Added to the SAB definitions since the size of the
                # write will depend on the other writes and reads
                sab_defs.append(me)
                
                thread.append(me)
                
            elif command_name == P_STORE:
                block_name = command[1]
                if not block_name in blocks:
                    raise ParsingErrorException("ERROR: SAB \"%s\" not defined"%block_name)

                if self.__var_type_is_float(command.typeop):
                    raise ParsingErrorException("ERROR: Atomics.store not supports float type")

                
                varsize = self.__get_var_size(command.typeop)

                if floop:
                    address = None
                    offset = "".join(list(command.address.asList())[1:][0])
                else:
                    addr = int(command.address[1])
                    baddr = varsize*addr
                    eaddr = (varsize*(addr+1))-1
                    address = range(baddr, eaddr+1, 1)
                    varsize = eaddr+1
                
                name = "%s_%s_%s"%(Memory_Event.get_unique_name(), WRITE, thread.get_name())
                me = Memory_Event(name = name, \
                                  operation = WRITE, \
                                  tear = None, \
                                  ordering = SC, \
                                  address = address, \
                                  block = blocks[block_name],\
                                  values = None)

                blocks[block_name].update_size(varsize)
                value = "".join(command.value.asList()[1:][0])

                if not floop:
                    try:
                        if self.__var_type_is_float(command.typeop):
                            me.set_values_from_float(float("".join(value)), baddr, eaddr)
                        elif self.__var_type_is_int(command.typeop):
                            me.set_values_from_int(int(value), baddr, eaddr)
                        else:
                            raise UnreachableCodeException("Invalid type")
                    except:
                        raise ParsingErrorException("ERROR: value %s cannot be encoded into %s bytes"%(value, eaddr))

                    thread.append(me)
                else:
                    me.set_param_value(varsize, value)
                    me.set_offset(offset) 
                    floop.append(me)

            elif command_name == P_SABASS:
                block_name = command.varname
                varsize = self.__get_var_size(command.typeop)

                if not block_name in blocks:
                    raise ParsingErrorException("ERROR: SAB \"%s\" not defined"%block_name)
                if floop:
                    address = None
                    offset = "".join(list(command.address.asList())[1:-1][0])
                elif command.address[2] == T_DOTS:
                    brange = int(command.address[1])
                    erange = int(command.address[3])

                    address = []
                    
                    for addr in range(brange, erange+1, 1):
                        baddr = varsize*addr
                        eaddr = (varsize*(addr+1))-1
                        address.append(range(baddr, eaddr+1, 1))
                    varsize = eaddr+1
                else:
                    addr = int(command.address[1])

                    baddr = varsize*addr
                    eaddr = (varsize*(addr+1))-1
                    address = range(baddr, eaddr+1, 1)
                    varsize = eaddr+1

                ordering = SC if self.__var_type_is_float(command.typeop) else UNORD
                name = "%s_%s_%s"%(Memory_Event.get_unique_name(), WRITE, thread.get_name())
                me = Memory_Event(name = name, \
                                  operation = WRITE, \
                                  tear = None, \
                                  ordering = ordering, \
                                  address = address, \
                                  block = blocks[block_name],\
                                  values = None)
                
                blocks[block_name].update_size(varsize)

                value = "".join(command.value)
                
                if not floop:
                    try:
                        if self.__var_type_is_float(command.typeop):
                            me.set_values_from_float(float(value), baddr, eaddr)
                        elif self.__var_type_is_int(command.typeop):
                            me.set_values_from_int(int(value), baddr, eaddr)
                        else:
                            raise UnreachableCodeException("Invalid type")
                    except:
                        raise ParsingErrorException("ERROR: value %s cannot be encoded into %s bytes"%(value, eaddr))

                    thread.append(me)
                else:
                    value = "".join(value)
                    me.set_param_value(varsize, value)
                    me.set_offset(offset) 
                    floop.append(me)

            elif command_name == P_ACCESS:
                block_name = command.varname
                if not block_name in blocks:
                    raise ParsingErrorException("ERROR: SAB \"%s\" not defined"%block_name)

                values = None
                varsize = self.__get_var_size(command.typeop)
                
                if floop:
                    address = None
                    offset = "".join(list(command.address.asList())[1:][0])
                else:
                    addr = int(command.address[1])
                    baddr = varsize*addr
                    eaddr = (varsize*(addr+1))-1
                    address = range(baddr, eaddr+1, 1)
                    varsize = eaddr+1
                    
                tear = WTEAR if self.__var_type_is_float(command.typeop) else NTEAR
                ordering = SC if self.__var_type_is_float(command.typeop) else UNORD
                name = "%s_%s_%s"%(Memory_Event.get_unique_name(), READ, thread.get_name())
                me = Memory_Event(name = name, \
                                  operation = READ, \
                                  tear = tear, \
                                  ordering = ordering, \
                                  address = address, \
                                  block = blocks[block_name],\
                                  values = values)

                blocks[block_name].update_size(varsize)
                if op_purpose:
                    me.set_op_purpose(op_purpose)
                    op_purpose = None

                if not floop:
                    thread.append(me)                                
                else:
                    me.set_param_value(varsize, None)
                    me.set_offset(offset)
                    floop.append(me)

            elif command_name == P_LOAD:
                block_name = command.varname
                if not block_name in blocks:
                    raise ParsingErrorException("ERROR: SAB \"%s\" not defined"%block_name)

                if self.__var_type_is_float(command.typeop):
                    raise ParsingErrorException("ERROR: Atomics.load not supports float type")

                values = None
                
                varsize = self.__get_var_size(command.typeop)

                if floop:
                    address = None
                    offset = "".join(list(command.address.asList()[1:])[0])
                else:
                    addr = int(command.address[1])
                    baddr = varsize*addr
                    eaddr = (varsize*(addr+1))-1
                    address = range(baddr, eaddr+1, 1)
                    varsize = eaddr+1

                tear = WTEAR if self.__var_type_is_float(command.typeop) else NTEAR

                name = "%s_%s_%s"%(Memory_Event.get_unique_name(), READ, thread.get_name())
                me = Memory_Event(name = name, \
                                  operation = READ, \
                                  tear = tear, \
                                  ordering = SC, \
                                  address = address, \
                                  block = blocks[block_name],\
                                  values = values)
                
                blocks[block_name].update_size(varsize)
                if op_purpose:
                    me.set_op_purpose(op_purpose)
                    op_purpose = None
                
                if not floop:
                    thread.append(me)
                else:
                    value = "".join(command.value)
                    me.set_param_value(varsize, value)
                    me.set_offset(offset)
                    floop.append(me)
                    


            elif command_name == P_PRINT:
                op_purpose = OP_PRINT
                if command.access:
                    self.commands.insert(0, command.access)
                    continue

                if command.load:
                    self.commands.insert(0, command.load)
                    continue
                
            elif command_name == P_VARASS:
                if command.access:
                    self.commands.insert(0, command.access)
                    continue

                if command.load:
                    self.commands.insert(0, command.load)
                    continue

            elif command_name == P_CSCOPE:
                if floop:
                    floop.get_uevents()
                    thread.append(floop)
                    floop = None
                else:
                    program.add_thread(thread)
                    thread = None
            elif command_name == P_FLOOP:
                floop = For_Loop()
                frind = int(command.range[0])
                toind = int(command.range[2])
                cname = command.varname
                floop.set_values(cname, frind, toind)
                continue
            elif command_name == P_COMMENT:
                continue
            else:
                raise UnreachableCodeException("Unhandled command: %s (%s)"%(" ".join(command), name))


        for sdef in sab_defs:
            sdef.set_init_values()

        self.program = program

        return program

            
    def get_commands(self):
        return self.commands

