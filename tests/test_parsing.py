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

from ecmasab.beparsing import BeParser, ParsingErrorException
from ecmasab.exceptions import UnreachableCodeException
from ecmasab.printers import PrintersFactory, PrinterType, CVC4Printer, JSV8Printer, BePrinter
from tests.input_tests import examples, invalids

def parse_and_generate(example, valid):
    try:
        strp = open("%s.txt"%example,"r").read()

        printers = PrintersFactory.get_printers()

        parser = BeParser()
        program = parser.program_from_string(strp)

        c4printer = PrintersFactory.printer_by_name(CVC4Printer().NAME)
        cprinters = PrintersFactory.get_printers_by_type(PrinterType.SMT)
        assert(c4printer in cprinters)

        c4printer.print_program(program)
        c4printer.print_data_type(program)
        c4printer.print_block_type(program)

        jprinter = PrintersFactory.printer_by_name(JSV8Printer().NAME)
        jprinters = PrintersFactory.get_printers_by_type(PrinterType.JS)
        assert(jprinter in jprinters)

        jprog = jprinter.print_program(program)
    except Exception as e:
        if not valid:
            print(e)
            return
        else:
            raise e

    if not valid:
        assert(False)
        
    if valid:
        with open("%s/program.js"%example,"r") as f:
            a = f.read()
            b = jprog
            assert a == b

        execsstr = open("%s/models.txt"%example,"r").read()
        execs = parser.executions_from_string(execsstr)
        eprint = c4printer.print_executions(execs)

        with open("%s/outputs.txt"%example,"r") as f:
            a = f.read().split("\n")
            b = jprinter.print_executions(program, execs).split("\n")
            a.sort()
            b.sort()
            assert a == b
    
    assert True

def be_parsing(example):
    strp = open("%s.txt"%example,"r").read()

    parser = BeParser()
    program = parser.program_from_string(strp)

    beprinter = PrintersFactory.printer_by_name(BePrinter().NAME)
    beprogram = beprinter.print_program(program)
    strp = re.sub("\n+","\n",strp)
    strp = re.sub("//.*\n","",strp)

    strp = strp.replace(" ","")
    beprogram = beprogram.replace(" ", "")

    if not(strp == beprogram):
        print strp
        print beprogram
    
    assert(strp == beprogram)
    
def test_parsing():
    for example in examples:
        yield parse_and_generate, example, True
        yield be_parsing, example

    for invalid in invalids:
        yield parse_and_generate, invalid, False
        
if __name__ == "__main__":
    for example in examples:
        be_parsing(example)

    for example in examples:
        parse_and_generate(example, True)

    for invalid in invalids:
        parse_and_generate(invalid, False)
        
