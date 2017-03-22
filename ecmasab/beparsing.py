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
import numpy
from six.moves import range

from ecmasab.execution import Thread, Program, Block, Memory_Event, Executions, Execution, Relation, For_Loop, ITE_Statement
from ecmasab.execution import READ, WRITE, MODIFY, ADD, INIT, SC, UNORD, WTEAR, NTEAR, MAIN
from ecmasab.execution import HB, RF, RBF, MO, SW
from ecmasab.exceptions import UnreachableCodeException

from pyparsing import ParseException, Word, nums, alphas, LineEnd, restOfLine, Literal, ZeroOrMore, Empty, \
    operatorPrecedence, opAssoc, Combine, Optional, White, Group

T_AADD = "Atomics.add"
T_ALOAD = "Atomics.load"
T_AND = "AND"
T_ASTORE = "Atomics.store"
T_BEQ = "=="
T_CCB = "}"
T_CM = ","
T_COM = "//"
T_CP = ")"
T_CSB = "]"
T_DIV = "/"
T_DONE = "DONE"
T_DOT = "."
T_DOTS = ".."
T_ELSE = "else"
T_EQ = "="
T_FLO32 = "-F32"
T_FLO64 = "-F64"
T_FOR = "for"
T_GEQ = ">="
T_GT = ">"
T_IF = "if"
T_INT16 = "-I16"
T_INT32 = "-I32"
T_INT8 = "-I8"
T_LEQ = "<="
T_LT = "<"
T_MIN = "-"
T_MUL = "*"
T_NEW = "new"
T_NL = "\n"
T_OCB = "{"
T_OP = "("
T_OPE = "op_"
T_OSB = "["
T_PARAMS = "Params"
T_PR = "print"
T_SAB = "SharedArrayBuffer"
T_SEMI = ";"
T_SUM = "+"
T_THREAD = "Thread"
T_US = "_"
T_VAL = "val_"
T_VAR = "var"

P_ACCESS = "access"
P_ADD = "add"
P_ADDR = "address"
P_ADDRSET = "address-set"
P_ASS = "assign"
P_BCOND = "bcond"
P_BIREL = "bi-relation"
P_COMMENT = "comment"
P_CSCOPE = "closescope"
P_ELSE = "else"
P_EMPTY = "empty"
P_EMREL = "em-relation"
P_EXPR = "expr"
P_FLOOP = "floop"
P_IF = "if"
P_INIT = "init"
P_INTER = "interval"
P_LIST = "list"
P_LOAD = "load"
P_OP = "operator"
P_PARAM = "param"
P_PARAMS = "params"
P_PRINT = "print"
P_RANGE = "range"
P_READ = "read"
P_SABASS = "sab-assign"
P_SABDEF = "sabdef"
P_SIZE = "varsize"
P_STORE = "store"
P_TRDB = "thread-begin"
P_TRREL = "tr-relation"
P_TYPEOP = "typeop"
P_VALUE = "value"
P_VLEFT = "vleft"
P_VNAME = "varname"
P_VRIGHT = "vright"
P_WRITE = "write"

class ParsingErrorException(Exception):
    pass

class BeParser(object):
    program_parser = None
    execution_parser = None
    
    DEBUG = False

    def __init__(self):
        Memory_Event.reset_unique_names()
        ITE_Statement.reset_unique_names()

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

        varassign = (T_OP + varname + T_EQ + varname + T_CP)(P_ASS)

        done = Literal(T_DONE)

        assign = trrelation | birelation | emrelation | varassign | done
        assigns = assign + ZeroOrMore(T_AND + assign)

        return assigns


    def __init_program_parser(self):
        ivalue = Word(nums)
        fvalue = Combine(ivalue + Optional(Literal(T_DOT) + Optional(ivalue)))
        nvalue = fvalue | ivalue
        strname = Word(alphas+nums+T_US)
        
        parval = (Combine(Literal(T_LT) + Literal(T_VAL) + Word(alphas+nums+T_US) + Literal(T_GT)))(P_PARAM)
        parop = (Literal(T_LT) + Literal(T_OPE) + Word(alphas+nums+T_US) + Literal(T_GT))(P_PARAM)
        
        varname = (strname)(P_VNAME)

        typeop = (Literal(T_FLO64) | Literal(T_FLO32) | Literal(T_INT8) | Literal(T_INT16) | Literal(T_INT32))(P_TYPEOP)
        sabname = varname + typeop

        operand = nvalue | parval | strname

        signop = Literal(T_SUM) | Literal(T_MIN)
        multop = Literal(T_MUL) | Literal(T_DIV)
        plusop = Literal(T_SUM) | Literal(T_MIN)

        expr = operatorPrecedence( operand,
                                   [(signop, 1, opAssoc.RIGHT),
                                    (multop, 2, opAssoc.LEFT),
                                    (plusop, 2, opAssoc.LEFT),]
        )
        
        interval = (Word(nums) + T_DOTS + Word(nums))(P_INTER)
        nrange = (nvalue + T_CM + nvalue + T_CM + nvalue)(P_RANGE)
        nlist = (Literal(T_OSB) + Word(nums) + ZeroOrMore(T_CM + Word(nums)) + Literal(T_CSB))(P_LIST)
        addr = (T_OSB + expr + T_CSB)(P_ADDR)
        
        emptyline = (ZeroOrMore(White(' \t')) + LineEnd())(P_EMPTY)
        comment = (T_COM + restOfLine + LineEnd())(P_COMMENT)

        sab_def = (T_VAR + varname + T_EQ + T_NEW + T_SAB + T_OP + T_CP)(P_SABDEF)

        value = (expr)(P_VALUE)
        
        ssaddr = (T_CM + expr)(P_ADDR)
        sabstore = (T_ASTORE + T_OP + sabname + ssaddr + T_CM + value + T_CP)(P_STORE)
        sabadd = (T_AADD + T_OP + sabname + ssaddr + T_CM + value + T_CP)(P_ADD)
        
        sabaccess = (sabname + addr)(P_ACCESS)
        sabload  = (T_ALOAD + T_OP + sabname + ssaddr + T_CP)(P_LOAD)

        sabread = (sabload | sabaccess | sabadd)

        sabassign = (sabaccess + T_EQ + value)(P_SABASS)
        printv = (T_PR + T_OP + sabread + T_CP)(P_PRINT)

        threaddef = (T_THREAD + varname + Literal(T_OCB))(P_TRDB)
        closescope = (Literal(T_CCB))(P_CSCOPE)

        floop = (Literal(T_FOR) + T_OP + varname + T_EQ + interval + T_CP + T_OCB)(P_FLOOP)

        op = (Literal(T_BEQ) | Literal(T_GEQ) | Literal(T_LEQ) | Literal(T_LT) | Literal(T_GT))(P_OP)
        oplist = (Literal(T_OSB) + op + ZeroOrMore(T_CM + op) + Literal(T_CSB))(P_LIST)

        lft_val = Group(sabread | expr).setResultsName(P_VLEFT)
        rgt_val = Group(sabread | expr).setResultsName(P_VRIGHT)
        
        bcond = ((lft_val) + (parop | op) + (rgt_val))(P_BCOND)
        ite = (Literal(T_IF) + T_OP + bcond + T_CP + T_OCB)(P_IF)
        els = (T_CCB + Literal(T_ELSE) + T_OCB)(P_ELSE)

        command = ((sabstore | sabadd | sab_def | sabassign | printv) + T_SEMI) | threaddef | floop | \
                  ite | els | closescope | comment | emptyline

        pardef = (strname + T_EQ + (interval | nrange | nlist | oplist) + T_SEMI)(P_PARAM)
        params = (Literal(T_PARAMS) + Literal(T_OCB))(P_PARAMS)
        
        return pardef | params | ZeroOrMore(command)

        
    def program_from_string(self, strinput):
        self.__init__()
        commands = self.__parse_program(strinput)
        program = self.__populate_program(commands)
        return program

    def executions_from_string(self, strinput, program=None):
        (models, done) = self.__parse_executions(strinput)
        executions = self.__populate_executions(models, program, done)
        
        if program:
            program.expand_events()
            self.__compute_reads_values(executions)

        return executions

    def __compute_reads_values(self, executions):
        for exe in executions.executions:
            events = exe.get_events()
            ev_map = dict((x.name, x) for x in events)
            read_evs = [x for x in events if x.is_read_or_modify()]
            
            rbf_map = dict(((x[0], int(x[2])), x[1]) for x in exe.get_RBF().tuples)
            for read_event in read_evs:
                values = []
                for i in read_event.address:
                    write_event = ev_map[rbf_map[(read_event.name, i)]]
                    value = write_event.get_values()[i]
                    values.append(value)
                new_read_event = copy.deepcopy(read_event)
                new_read_event.set_values(values)
                exe.add_read_values(new_read_event)
    
    def __parse_executions(self, strinput):
        models = []
        done = False
        for line in strinput.split(T_NL):
            if line == "": continue
            if T_DONE in line:
                done = True
                continue
            rels = []
            for relation in line.split(T_AND):
                if relation == "": continue
                rels.append(self.execution_parser.parseString(relation))
            models.append(rels)

        return (models, done)

    def __populate_executions(self, models, program, done):
        executions = Executions()
        executions.allexecs = done
        executions.program = program
        for model in models:
            execution = Execution()
            for assign in model:
                if assign.getName() == P_ASS:
                    variable = assign[1]
                    value = assign[3]
                    execution.add_condition(variable, value)
                else:
                    rel = Relation(assign[0])
                    size = 9 if assign.getName() == P_TRREL else \
                           6 if assign.getName() == P_BIREL else 0
                    if size == 0: continue
                    for i in range(3, len(assign), size):
                        rel.add_tuple(self.__get_tuple(size, assign[i:i+size]))

                    self.__add_relation(execution, rel)
            executions.add_execution(execution)

        return executions

    def __add_relation(self, exe, rel):

        if rel.name == HB:
            exe.set_HB(rel)
        elif rel.name == MO:
            exe.set_MO(rel)
        elif rel.name == RBF:
            exe.set_RBF(rel)
        elif rel.name == RF:
            exe.set_RF(rel)
        elif rel.name == SW:
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
        commands = []
        for line in strinput.split(T_NL):
            try:
                pline = self.program_parser.parseString(line, parseAll=True)
            except ParseException:
                if self.DEBUG: raise
                raise ParsingErrorException("ERROR (L%s): unhandled command \"%s\""%(len(commands)+1, line.strip()))
            commands.append(pline)

        return commands

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

    def __gen_memory_event(self, command, ctype, parametric, thread, blocks):

        ordering = None
        operation = None
        operator = None

        if ctype == P_STORE:
            ordering = SC
            operation = WRITE

        elif ctype == P_LOAD:
            ordering = SC
            operation = READ
            
        elif ctype == P_ACCESS:
            ordering = UNORD
            operation = READ
            
        elif ctype == P_SABASS:
            ordering = UNORD
            operation = WRITE

        elif ctype == P_ADD:
            ordering = SC
            operation = MODIFY
            operator = ADD
            
        else:
            raise UnreachableCodeException("Type \"%s\" is invalid"%ctype)
        
        block_name = command.varname
        opsize = self.__get_var_size(command.typeop)
        varsize = None
        
        address = None
        offset = None

        try:
            addr = int(command.address[1])
            baddr = opsize*addr
            eaddr = (opsize*(addr+1))-1
            address = range(baddr, eaddr+1, 1)
            varsize = eaddr+1
        except Exception:
            pass

        if parametric:
            offset = list(command.address.asList())[1:]
            if ctype == P_SABASS:
                offset = offset[:-1]
            offset = "".join(offset[0])

        me = Memory_Event()

        me.name = "%s_%s_%s"%(Memory_Event.get_unique_name(), operation, thread.name)
        me.ordering = SC if self.__var_type_is_float(command.typeop) else ordering
        me.tear = WTEAR if self.__var_type_is_float(command.typeop) else NTEAR
        me.operation = operation
        me.operator = operator
        me.address = address

        if block_name not in blocks:
            raise ParsingErrorException("block \"%s\" is not defined"%(block_name))
        me.block = blocks[block_name]

        blocks[block_name].update_size(varsize)
        
        for check_addr in [offset, address]:
            if check_addr:
                if T_VAL in str(check_addr):
                    raise ParsingErrorException("Parametric address definition is not supported")


        value = command.value            

        if parametric:
            me.size = opsize
            me.value = list(value)
            me.offset = offset
            me.tear = WTEAR if self.__var_type_is_float(command.typeop) else NTEAR
        elif me.is_write_or_modify():
            try:
                if self.__var_type_is_float(command.typeop):
                    me.set_values_from_float(float("".join(value)), baddr, eaddr)
                if self.__var_type_is_int(command.typeop):
                    me.set_values_from_int(int("".join(value)), baddr, eaddr)
            except:
                if self.DEBUG: raise
                raise ParsingErrorException("value \"%s\" cannot be encoded into %s bytes"%("".join(value), varsize))
        else:
            pass

        return me

    def __populate_program(self, commands):
        program = Program()
        thread = Thread(MAIN)
        floop = None
        params = False
        used_params = []
        defined_params = {}
        ite = None
        blocks = {}
        sab_defs = []
        linenum = 0
        name = ""
        while len(commands):
            linenum += 1
            command = commands[0]
            commands = commands[1:]
            command_name = command.getName()

            if command_name == P_TRDB:
                thread_name = command[1]
                if thread:
                    program.add_thread(thread)
                thread = Thread(thread_name)
                
            elif command_name == P_SABDEF:
                block_name = command.varname
                block = Block(block_name)
                blocks[block_name] = block

                name = "%s_%s_%s"%(Memory_Event.get_unique_name(), WRITE, thread.name)
                me = Memory_Event()

                me.name = name
                me.operation = WRITE
                me.tear = NTEAR
                me.ordering = INIT
                me.block = block
                
                # Added to the SAB definitions since the size of the
                # write will depend on the other writes and reads
                sab_defs.append(me)
                
                thread.append(me)
                
            elif command_name in [P_STORE, P_SABASS, P_ACCESS, P_LOAD, P_ADD]:
                block_name = command.varname

                if block_name not in blocks:
                    raise ParsingErrorException("ERROR (L%s): SAB \"%s\" not defined"%(linenum, block_name))

                if self.__var_type_is_float(command.typeop) and (command_name in [P_STORE, P_LOAD, P_ADD]):
                    raise ParsingErrorException("ERROR (L%s): Atomic operations not support the float type"%linenum)

                param = False

                if type(command.value) == str:
                    command.value = [command.value]

                for i in range(len(command.value)):
                    if T_VAL in command.value[i]:
                        param = True
                        pname = command.value[i][1:-1]
                        command.value[i] = pname
                        used_params.append(pname)
                    
                if floop:
                    param = True

                try:                
                    me = self.__gen_memory_event(command, command_name, param, thread, blocks)
                except ParsingErrorException as e:
                    if self.DEBUG: raise
                    raise ParsingErrorException("ERROR (L%s): %s"%(linenum, str(e)))

                if floop:
                    floop.append(me)
                elif ite:
                    if ite.has_else():
                        ite.append_else(me)
                    else:
                        ite.append_then(me)
                else:                    
                    thread.append(me)

            elif command_name == P_PRINT:
                if command.access:
                    commands.insert(0, command.access)
                elif command.load:
                    commands.insert(0, command.load)
                elif command.add:
                    commands.insert(0, command.add)
                else:
                    raise ParsingErrorException("ERROR (L%s): cannot print command \"%s\""%(linenum, "".join(command)))
                    
            elif command_name == P_CSCOPE:
                if floop:
                    floop.get_uevents()
                    thread.append(floop)
                    floop = None
                elif ite:
                    thread.append(ite)
                    ite = None
                elif params:
                    params = False
                    diff = set(used_params) - set([x for x in defined_params])
                    if len(diff):
                        raise ParsingErrorException("ERROR: parameters not defined \"%s\""%(", ".join(list(diff))))

                    for par in used_params:
                        program.add_param(par, defined_params[par])

                else:
                    program.add_thread(thread)
                    thread = None
            
            elif command_name == P_FLOOP:
                if ite or floop:
                    raise ParsingErrorException("ERROR (L%s): nested ifs or for-loops are not supported"%(linenum))
                
                floop = For_Loop()
                frind = int(command.interval[0])
                toind = int(command.interval[2])
                cname = command.varname
                floop.set_values(cname, frind, toind)
            
            elif command_name == P_IF:
                if ite or floop:
                    raise ParsingErrorException("ERROR (L%s): nested ifs or for-loops are not supported"%(linenum))
                
                ite = ITE_Statement()
                condition = command.bcond
                op = None

                if P_PARAM in dict(command):
                    command.param = "".join(command.param[1:3])
                    command.operator = command.param
                    used_params.append(command.param)
                
                ldict = dict(condition.vleft)
                rdict = dict(condition.vright)

                lval = None
                rval = None

                try:                
                    if len([k for k in ldict if k in (P_LOAD, P_ACCESS)]):
                        op = P_LOAD if P_LOAD in ldict else P_ACCESS
                        lval = self.__gen_memory_event(condition.vleft, op, False, thread, blocks)
                    else:
                        lval = "".join(condition.vleft)
                        if P_PARAM in ldict:
                            lval = lval[1:-1]
                            used_params.append(lval)


                    if len([k for k in rdict if k in (P_LOAD, P_ACCESS)]):
                        op = P_LOAD if P_LOAD in rdict else P_ACCESS
                        rval = self.__gen_memory_event(condition.vright, op, False, thread, blocks)
                    else:
                        rval = "".join(condition.vright)
                        if P_PARAM in rdict:
                            rval = rval[1:-1]
                            used_params.append(rval)
                        
                except ParsingErrorException as e:
                    if self.DEBUG: raise
                    raise ParsingErrorException("ERROR (L%s): %s"%(linenum, str(e)))


                ite.append_condition(lval, command.operator, rval)

            elif command_name == P_ELSE:
                ite.else_events = []

            elif command_name == P_PARAM:
                params = True

                if P_INTER in dict(command):
                    values = range(int(command.interval[0]), int(command.interval[2])+1, 1)
                elif P_RANGE in dict(command):
                    start = float(command.range[0])
                    end = float(command.range[2])
                    step = float(command.range[4])
                    values = [float(x) for x in numpy.arange(start, end+step, step) if x <=end]
                elif P_LIST in dict(command):
                    values = [x for x in command.list[1:-1] if x != T_CM]

                defined_params[command.param[0]] = values

            elif command_name == P_PARAMS:
                pass
                
            elif (command_name == P_COMMENT) or (command_name == P_EMPTY):
                pass
            else:
                raise ParsingErrorException("ERROR (L%s): unhandled command \"%s\" (%s)"%(linenum, " ".join(command), name))

        for sdef in sab_defs:
            sdef.set_init_values()

        return program

