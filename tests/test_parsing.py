#!/usr/bin/env python

# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import unittest
import re

from ecmasab.beparsing import BeParser
from ecmasab.printers import PrintersFactory, CVC4Printer, JSV8Printer, BePrinter

sv = "examples/single_var/sv_simple%s"
dv = "examples/double_vars/dv_simple%s"
tv = "examples/triple_vars/tv_simple%s"

examples = []

# Single variable examples
examples.append(sv%"01")
examples.append(sv%"02")
examples.append(sv%"03")
examples.append(sv%"04")
examples.append(sv%"05")
examples.append(sv%"06")
examples.append(sv%"07")
examples.append(sv%"08")
examples.append(sv%"09")
examples.append(sv%"10")
examples.append(sv%"11")
examples.append(sv%"12")
examples.append(sv%"13")
examples.append(sv%"14")
examples.append(sv%"15")
examples.append(sv%"16")
examples.append(sv%"17")
examples.append(sv%"18")
examples.append(sv%"19")

# Double variables examples
examples.append(dv%"01")

# Triple variables examples
examples.append(tv%"01")

def parse_and_generate(example):

    strp = open("%s.txt"%example,"r").read()

    printers = PrintersFactory.get_printers()
    
    parser = BeParser()
    program = parser.program_from_string(strp)

    c4printer = PrintersFactory.printer_by_name(CVC4Printer().NAME)

    c4printer.print_program(program)
    c4printer.print_data_type(program)
    c4printer.print_block_type(program)

    jprinter = PrintersFactory.printer_by_name(JSV8Printer().NAME)
    jprog = jprinter.print_program(program)

    with open("%s/program.js"%example,"r") as f:
        a = f.read()
        b = jprog
        assert a == b
    
    execsstr = open("%s/models.txt"%example,"r").read()
    execs = parser.executions_from_string(execsstr)
    eprint = c4printer.print_executions(execs)
    
    with open("%s/outputs.txt"%example,"r") as f:
        a = f.read()
        b = jprinter.print_executions(program, execs)
        assert a == b
    
    assert True

def be_parsing(example):
    strp = open("%s.txt"%example,"r").read()

    parser = BeParser()
    program = parser.program_from_string(strp)

    beprinter = PrintersFactory.printer_by_name(BePrinter().NAME)
    beprogram = beprinter.print_program(program)
    strp = re.sub("\n+","\n",strp)

    strp = strp.replace(" ","")
    beprogram = beprogram.replace(" ", "")
    
    assert(strp == beprogram)
    
def test_sv_parsing():
    for example in examples:
        yield parse_and_generate, example
        yield be_parsing, example

if __name__ == "__main__":
    for example in examples:
        be_parsing(example)
    
